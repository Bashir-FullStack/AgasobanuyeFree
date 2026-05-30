const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

const ALLOWED_REVIEW_FIELDS = ['user_id', 'product_id', 'rating', 'comment'];

function sanitize(body) {
  const clean = {};
  for (const key of ALLOWED_REVIEW_FIELDS) {
    if (body[key] !== undefined) clean[key] = body[key];
  }
  return clean;
}

function validateReview(body, isUpdate = false) {
  const errors = [];
  if (!isUpdate) {
    if (!body.user_id) errors.push('user_id is required');
    if (!body.product_id) errors.push('product_id is required');
  }
  if (body.rating !== undefined) {
    const r = Number(body.rating);
    if (isNaN(r) || !Number.isInteger(r) || r < 1 || r > 5) {
      errors.push('rating must be an integer between 1 and 5');
    }
  }
  if (!isUpdate && body.rating === undefined) {
    errors.push('rating is required');
  }
  if (body.comment !== undefined && typeof body.comment !== 'string') {
    errors.push('comment must be a string');
  }
  return errors;
}

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('reviews').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('reviews').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const errors = validateReview(req.body);
    if (errors.length) return res.status(400).json({ error: errors.join('; ') });
    const clean = sanitize(req.body);
    const { data, error } = await supabase.from('reviews').insert(clean).select();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const errors = validateReview(req.body, true);
    if (errors.length) return res.status(400).json({ error: errors.join('; ') });
    const clean = sanitize(req.body);
    if (Object.keys(clean).length === 0) return res.status(400).json({ error: 'No valid fields to update' });
    const { data, error } = await supabase.from('reviews').update(clean).eq('id', req.params.id).select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('reviews').delete().eq('id', req.params.id).select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
