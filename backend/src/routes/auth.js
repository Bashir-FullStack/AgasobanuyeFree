const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = process.env.ADMIN_TOKEN || 'admin_token_2026';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@agasobanuye.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@2024';
    if (email === adminEmail && password === adminPassword) {
      return res.json({ token, user: { id: 1, email, name: 'Admin', role: 'admin' } });
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('role', 'admin')
      .single();
    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (data.password === password) {
      return res.json({ token, user: { id: data.id, email: data.email, name: data.name, role: data.role } });
    }
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const token = process.env.ADMIN_TOKEN || 'admin_token_2026';
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ name: name || email.split('@')[0], email, password, role: 'user' })
      .select()
      .single();
    if (error) throw error;
    res.json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Credential required' });
    }
    const token = process.env.ADMIN_TOKEN || 'admin_token_2026';
    const payload = JSON.parse(Buffer.from(credential.split('.')[1], 'base64url').toString());
    const { email, name, picture, sub } = payload;
    if (!email) {
      return res.status(400).json({ error: 'Invalid Google credential' });
    }
    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (existing) {
      return res.json({ token, user: { id: existing.id, email: existing.email, name: existing.name, role: existing.role, avatar: existing.avatar || picture } });
    }
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({ email, name: name || email.split('@')[0], password: '', role: 'user', avatar: picture || '' })
      .select()
      .single();
    if (error) throw error;
    res.json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, avatar: newUser.avatar } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
