const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client();
const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '24h';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required but not set');
}

function generateToken(user) {
  return jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (error) throw error;
    if (!data || !data.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const validPassword = await bcrypt.compare(password, data.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = generateToken(data);
    res.json({ token, user: { id: data.id, email: data.email, name: data.name, role: data.role, avatar: data.avatar } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const { data: existing, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ name: name || email.split('@')[0], email, password: hashedPassword, role: 'user' })
      .select()
      .single();
    if (error) throw error;
    const token = generateToken(newUser);
    res.json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential required' });
    }
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    if (!email) {
      return res.status(400).json({ error: 'Invalid Google credential' });
    }
    const { data: existing, error: lookupError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (lookupError) throw lookupError;
    let user;
    if (existing) {
      user = existing;
    } else {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({ email, name: name || email.split('@')[0], password: '', role: 'user', avatar: picture || '' })
        .select()
        .single();
      if (insertError) throw insertError;
      user = newUser;
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar || picture } });
  } catch (err) {
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

module.exports = router;
