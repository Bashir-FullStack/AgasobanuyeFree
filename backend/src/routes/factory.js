const express = require('express');
const supabase = require('../supabase');

const DEFAULT_SENSITIVE_FIELDS = ['password', 'password_hash', 'token', 'secret'];

function sanitizeBody(body, allowedFields) {
  if (!allowedFields || allowedFields.length === 0) return body;
  const clean = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) clean[key] = body[key];
  }
  return clean;
}

function stripSensitiveFields(data, sensitiveFields) {
  if (!data) return data;
  const fields = sensitiveFields || DEFAULT_SENSITIVE_FIELDS;
  const strip = (obj) => {
    const clean = { ...obj };
    for (const field of fields) {
      delete clean[field];
    }
    return clean;
  };
  if (Array.isArray(data)) return data.map(strip);
  return strip(data);
}

function createCrudRoutes(tableName, options = {}) {
  const {
    validators = {},
    allowedFields = [],
    sensitiveFields = DEFAULT_SENSITIVE_FIELDS,
    selectFields = '*',
    orderBy = 'id',
    middleware = [],
    getMiddleware = [],
    postMiddleware = [],
    putMiddleware = [],
    deleteMiddleware = [],
  } = options;

  const router = express.Router();

  // GET / - List all
  router.get('/', ...getMiddleware, async (req, res) => {
    try {
      let query = supabase.from(tableName).select(selectFields);
      if (orderBy) {
        query = query.order(orderBy, { ascending: true });
      }
      const { data, error } = await query;
      if (error) throw error;
      res.json(stripSensitiveFields(data, sensitiveFields));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /:id - Get one
  router.get('/:id', ...getMiddleware, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select(selectFields)
        .eq('id', req.params.id)
        .single();
      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json(stripSensitiveFields(data, sensitiveFields));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST / - Create
  router.post('/', ...postMiddleware, async (req, res) => {
    try {
      if (validators.create) {
        const errors = validators.create(req.body);
        if (errors && errors.length > 0) {
          return res.status(400).json({ error: errors.join('; ') });
        }
      }
      const clean = sanitizeBody(req.body, allowedFields);
      const { data, error } = await supabase.from(tableName).insert(clean).select();
      if (error) throw error;
      res.status(201).json(stripSensitiveFields(data, sensitiveFields));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PUT /:id - Update
  router.put('/:id', ...putMiddleware, async (req, res) => {
    try {
      if (validators.update) {
        const errors = validators.update(req.body);
        if (errors && errors.length > 0) {
          return res.status(400).json({ error: errors.join('; ') });
        }
      }
      const clean = sanitizeBody(req.body, allowedFields);
      if (Object.keys(clean).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }
      const { data, error } = await supabase
        .from(tableName)
        .update(clean)
        .eq('id', req.params.id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json(stripSensitiveFields(data, sensitiveFields));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE /:id - Delete
  router.delete('/:id', ...deleteMiddleware, async (req, res) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', req.params.id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted', data: stripSensitiveFields(data, sensitiveFields) });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}

module.exports = createCrudRoutes;
