const express = require('express');
const { body, param, validationResult } = require('express-validator');
const supabase = require('../supabase');

const TABLE = 'interpreters';
const SELECT_FIELDS = 'id, name, created_at, updated_at';

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }
}

function createRouter() {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select(SELECT_FIELDS)
        .order('name', { ascending: true });
      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id', [
    param('id').isInt().withMessage('ID must be an integer'),
  ], async (req, res) => {
    handleValidation(req, res);
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select(SELECT_FIELDS)
        .eq('id', req.params.id)
        .single();
      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Interpreter not found' });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  ], async (req, res) => {
    handleValidation(req, res);
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .insert({ name: req.body.name.trim() })
        .select(SELECT_FIELDS);
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/:id', [
    param('id').isInt().withMessage('ID must be an integer'),
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  ], async (req, res) => {
    handleValidation(req, res);
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .update({ name: req.body.name.trim() })
        .eq('id', req.params.id)
        .select(SELECT_FIELDS);
      if (error) throw error;
      if (!data || data.length === 0) return res.status(404).json({ error: 'Interpreter not found' });
      res.json(data[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', [
    param('id').isInt().withMessage('ID must be an integer'),
  ], async (req, res) => {
    handleValidation(req, res);
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .delete()
        .eq('id', req.params.id)
        .select(SELECT_FIELDS);
      if (error) throw error;
      if (!data || data.length === 0) return res.status(404).json({ error: 'Interpreter not found' });
      res.json({ message: 'Deleted', data: data[0] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

module.exports = createRouter();
