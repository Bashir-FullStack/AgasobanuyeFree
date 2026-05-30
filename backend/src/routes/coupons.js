const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.post('/validate', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }
    if (orderTotal === undefined || typeof orderTotal !== 'number' || orderTotal < 0) {
      return res.status(400).json({ error: 'Valid order total is required' });
    }

    const { data: coupon, error } = await supabase
      .from('promo')
      .select('*')
      .ilike('code', code.trim())
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    const now = new Date();
    if (coupon.start_date && new Date(coupon.start_date) > now) {
      return res.status(400).json({ error: 'This coupon is not yet active' });
    }
    if (coupon.end_date && new Date(coupon.end_date) < now) {
      return res.status(400).json({ error: 'This coupon has expired' });
    }

    if (coupon.min_order && orderTotal < coupon.min_order) {
      return res.status(400).json({
        error: `Minimum order total of ${coupon.min_order} required`,
      });
    }

    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return res.status(400).json({ error: 'This coupon has reached its usage limit' });
    }

    const discountPercent = Number(coupon.discount_percent) || 0;
    const discountAmount = Math.round(orderTotal * (discountPercent / 100) * 100) / 100;

    res.json({
      valid: true,
      code: coupon.code || coupon.title,
      discountPercent,
      discountAmount,
      finalTotal: Math.round((orderTotal - discountAmount) * 100) / 100,
      description: coupon.description || null,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to validate coupon', details: err.message });
  }
});

module.exports = router;
