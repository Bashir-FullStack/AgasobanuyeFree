const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.get('/config', (req, res) => {
  try {
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
    if (!publishableKey) {
      return res.json({ publishableKey: '', configured: false });
    }
    res.json({ publishableKey, configured: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment config' });
  }
});

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, orderId, metadata } = req.body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required (positive number in cents)' });
    }
    if (currency && typeof currency !== 'string') {
      return res.status(400).json({ error: 'Currency must be a string' });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (stripeKey) {
      const stripe = require('stripe')(stripeKey);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency: (currency || 'usd').toLowerCase(),
        metadata: { orderId: orderId || '', ...(metadata || {}) },
        automatic_payment_methods: { enabled: true },
      });
      return res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

    const mockPaymentIntentId = 'pi_mock_' + Date.now();
    const mockClientSecret = mockPaymentIntentId + '_secret_' + Math.random().toString(36).slice(2);

    if (orderId) {
      const { error } = await supabase
        .from('orders')
        .update({ payment_intent_id: mockPaymentIntentId, payment_status: 'pending' })
        .eq('id', orderId);
      if (error) throw error;
    }

    res.json({
      clientSecret: mockClientSecret,
      paymentIntentId: mockPaymentIntentId,
      mock: true,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create payment intent', details: err.message });
  }
});

router.post('/confirm', async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'paymentIntentId is required' });
    }

    if (orderId) {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: 'paid', status: 'confirmed' })
        .eq('id', orderId);
      if (error) throw error;
    }

    res.json({ status: 'succeeded', paymentIntentId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to confirm payment', details: err.message });
  }
});

module.exports = router;
