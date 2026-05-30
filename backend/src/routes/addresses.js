const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret_change_me';

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

router.get('/', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { full_name, phone, province, district, sector, street, is_default } = req.body;

    if (!full_name || !phone || !province || !district || !sector) {
      return res.status(400).json({ error: 'full_name, phone, province, district, and sector are required' });
    }

    if (is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', req.user.userId)
        .eq('is_default', true);
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: req.user.userId,
        full_name,
        phone,
        province,
        district,
        sector,
        street: street || null,
        is_default: is_default || false,
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { full_name, phone, province, district, sector, street, is_default } = req.body;

    const { data: existing, error: fetchError } = await supabase
      .from('addresses')
      .select('id, user_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;
    if (!existing) return res.status(404).json({ error: 'Address not found' });
    if (existing.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', req.user.userId)
        .eq('is_default', true);
    }

    const fields = {};
    if (full_name !== undefined) fields.full_name = full_name;
    if (phone !== undefined) fields.phone = phone;
    if (province !== undefined) fields.province = province;
    if (district !== undefined) fields.district = district;
    if (sector !== undefined) fields.sector = sector;
    if (street !== undefined) fields.street = street;
    if (is_default !== undefined) fields.is_default = is_default;

    fields.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('addresses')
      .update(fields)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('addresses')
      .select('id, user_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;
    if (!existing) return res.status(404).json({ error: 'Address not found' });
    if (existing.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
