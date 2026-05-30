const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

router.get('/me/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [ordersResult, wishlistResult] = await Promise.all([
      supabase
        .from('orders')
        .select('id, status, total', { count: 'exact' })
        .eq('user_id', userId),
      supabase
        .from('wishlist')
        .select('id', { count: 'exact' })
        .eq('user_id', userId),
    ]);

    if (ordersResult.error) throw ordersResult.error;
    if (wishlistResult.error) throw wishlistResult.error;

    const orders = ordersResult.data || [];
    const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    res.json({
      totalOrders: orders.length,
      totalSpent: Math.round(totalSpent * 100) / 100,
      wishlistCount: wishlistResult.count || 0,
      ordersByStatus: {
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user stats', details: err.message });
  }
});

router.put('/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone } = req.body;

    const updates = {};
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Name must be a non-empty string' });
      }
      updates.name = name.trim();
    }
    if (phone !== undefined) {
      if (typeof phone !== 'string') {
        return res.status(400).json({ error: 'Phone must be a string' });
      }
      updates.phone = phone.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select('id, email, name, phone, avatar, role')
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'User not found' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile', details: err.message });
  }
});

module.exports = router;
