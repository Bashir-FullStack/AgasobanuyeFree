const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

const ALLOWED_PROMO_FIELDS = ['title', 'description', 'discount_percent', 'start_date', 'end_date', 'is_active'];

function sanitize(body) {
  const clean = {};
  for (const key of ALLOWED_PROMO_FIELDS) {
    if (body[key] !== undefined) clean[key] = body[key];
  }
  return clean;
}

function validatePromo(body, isUpdate = false) {
  const errors = [];
  if (!isUpdate) {
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      errors.push('title is required and must be a non-empty string');
    }
  } else {
    if (body.title !== undefined && (typeof body.title !== 'string' || !body.title.trim())) {
      errors.push('title must be a non-empty string');
    }
  }
  if (body.discount_percent !== undefined) {
    const d = Number(body.discount_percent);
    if (isNaN(d) || d < 0 || d > 100) errors.push('discount_percent must be between 0 and 100');
  }
  if (body.start_date && body.end_date) {
    if (new Date(body.end_date) < new Date(body.start_date)) {
      errors.push('end_date must be after start_date');
    }
  }
  return errors;
}

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('promos').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('promos').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const errors = validatePromo(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join('; ') });
    const clean = sanitize(req.body);
    const { data, error } = await supabase.from('promos').insert(clean).select();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const errors = validatePromo(req.body, true);
    if (errors.length) return res.status(400).json({ error: errors.join('; ') });
    const clean = sanitize(req.body);
    if (Object.keys(clean).length === 0) return res.status(400).json({ error: 'No valid fields to update' });
    const { data, error } = await supabase.from('promos').update(clean).eq('id', req.params.id).select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('promos').delete().eq('id', req.params.id).select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
