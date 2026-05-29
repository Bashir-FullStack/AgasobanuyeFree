const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('movies').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('movies').select('*').eq('id', req.params.id).single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('movies').insert(req.body).select();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('movies').update(req.body).eq('id', req.params.id).select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('movies').delete().eq('id', req.params.id).select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
