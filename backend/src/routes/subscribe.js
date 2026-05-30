const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, is_active')
      .ilike('email', trimmedEmail)
      .maybeSingle();

    if (existing) {
      if (existing.is_active) {
        return res.status(409).json({ error: 'Email is already subscribed' });
      }

      const { data, error } = await supabase
        .from('subscribers')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return res.json({ message: 'Subscription reactivated', subscriber: data });
    }

    const { data, error } = await supabase
      .from('subscribers')
      .insert({ email: trimmedEmail, is_active: true })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Subscribed successfully', subscriber: data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to subscribe', details: err.message });
  }
});

router.get('/check', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }

    const { data, error } = await supabase
      .from('subscribers')
      .select('id, is_active')
      .ilike('email', email.trim())
      .maybeSingle();

    if (error) throw error;

    res.json({
      subscribed: !!data && data.is_active,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check subscription', details: err.message });
  }
});

module.exports = router;
