const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production';

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cart')
      .select('*, products(*)')
      .eq('user_id', req.user.userId);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id) {
      return res.status(400).json({ error: 'product_id is required' });
    }
    const qty = parseInt(quantity) || 1;
    if (qty < 1) {
      return res.status(400).json({ error: 'quantity must be at least 1' });
    }

    const { data: existing } = await supabase
      .from('cart')
      .select('id, quantity')
      .eq('user_id', req.user.userId)
      .eq('product_id', product_id)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity: existing.quantity + qty })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return res.json(data);
    }

    const { data, error } = await supabase
      .from('cart')
      .insert({ user_id: req.user.userId, product_id, quantity: qty })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    const qty = parseInt(quantity);
    if (!qty || qty < 1) {
      return res.status(400).json({ error: 'quantity must be at least 1' });
    }

    const { data, error } = await supabase
      .from('cart')
      .update({ quantity: qty })
      .eq('id', req.params.id)
      .eq('user_id', req.user.userId)
      .select()
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Cart item not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cart')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user.userId)
      .select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', req.user.userId);
    if (error) throw error;
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
