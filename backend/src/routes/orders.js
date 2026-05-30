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

router.get('/', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase.from('orders').select('*, order_items(*)');

    if (req.user.role !== 'admin') {
      query = query.eq('user_id', req.user.userId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (error) throw error;

    const { count: total } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.userId);

    res.json({ data, total: total || 0, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Order not found' });

    if (req.user.role !== 'admin' && data.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/tracking', verifyToken, async (req, res) => {
  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, user_id, status, tracking_number, delivery_location, estimated_delivery')
      .eq('id', req.params.id)
      .single();

    if (orderError) throw orderError;
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (req.user.role !== 'admin' && order.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { data: statusHistory, error: historyError } = await supabase
      .from('order_status_history')
      .select('*')
      .eq('order_id', req.params.id)
      .order('created_at', { ascending: true });

    if (historyError) throw historyError;

    res.json({
      order_id: order.id,
      status: order.status,
      tracking_number: order.tracking_number,
      delivery_location: order.delivery_location,
      estimated_delivery: order.estimated_delivery,
      status_history: statusHistory || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { items, payment, address, couponCode, delivery } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }
    if (!payment || !payment.method) {
      return res.status(400).json({ error: 'Payment method is required' });
    }
    if (!address) {
      return res.status(400).json({ error: 'Delivery address is required' });
    }

    for (const item of items) {
      if (!item.movie_id || !item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: 'Each item must have movie_id and quantity >= 1' });
      }
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const { data: movie, error: movieError } = await supabase
        .from('movies')
        .select('id, price, title')
        .eq('id', item.movie_id)
        .single();

      if (movieError || !movie) {
        return res.status(400).json({ error: `Movie not found: ${item.movie_id}` });
      }

      const itemTotal = (movie.price || 0) * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        movie_id: item.movie_id,
        title: movie.title,
        price: movie.price || 0,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    let discount = 0;
    if (couponCode) {
      const { data: coupon, error: couponError } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode)
        .eq('active', true)
        .single();

      if (couponError || !coupon) {
        return res.status(400).json({ error: 'Invalid coupon code' });
      }

      if (coupon.discount_type === 'percentage') {
        discount = subtotal * (coupon.discount_value / 100);
      } else {
        discount = coupon.discount_value;
      }
      discount = Math.min(discount, subtotal);
    }

    let deliveryFee = 0;
    if (delivery && delivery.location_id) {
      const { data: location } = await supabase
        .from('delivery_locations')
        .select('fee')
        .eq('id', delivery.location_id)
        .single();
      if (location) deliveryFee = location.fee || 0;
    }

    const total = subtotal - discount + deliveryFee;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: req.user.userId,
        subtotal,
        discount,
        delivery_fee: deliveryFee,
        total,
        status: 'pending',
        payment_method: payment.method,
        payment_status: payment.method === 'cash_on_delivery' ? 'pending' : 'processing',
        shipping_address: address,
        delivery_location: delivery || null,
        coupon_code: couponCode || null,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const itemsToInsert = orderItems.map(item => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
    if (itemsError) throw itemsError;

    await supabase.from('order_status_history').insert({
      order_id: order.id,
      status: 'pending',
      note: 'Order created',
    });

    if (couponCode) {
      await supabase.from('coupons').update({
        times_used: supabase.rpc ? undefined : undefined,
      }).eq('code', couponCode);
    }

    const { data: fullOrder } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', order.id)
      .single();

    res.status(201).json(fullOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, user_id, status')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (req.user.role !== 'admin' && order.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (req.user.role !== 'admin' && status !== 'cancelled') {
      return res.status(403).json({ error: 'Only admins can update order status' });
    }

    const { data: updated, error: updateError } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    await supabase.from('order_status_history').insert({
      order_id: req.params.id,
      status,
      note: note || `Status updated to ${status}`,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
