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

router.get('/locations', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('delivery_locations')
      .select('*')
      .eq('active', true)
      .order('province')
      .order('sector');

    if (error) throw error;

    const grouped = {};
    (data || []).forEach(loc => {
      if (!grouped[loc.province]) {
        grouped[loc.province] = [];
      }
      grouped[loc.province].push(loc);
    });

    res.json({ locations: data || [], grouped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/settings', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('web_settings')
      .select('data')
      .eq('section', 'delivery')
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    const settings = data?.data || {
      free_delivery_threshold: 50000,
      default_fee: 2000,
      estimated_days: { min: 1, max: 3 },
      provinces: [
        'Kigali',
        'Northern',
        'Southern',
        'Eastern',
        'Western',
      ],
    };

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
