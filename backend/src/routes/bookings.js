const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

const ALLOWED_BOOKING_FIELDS = [
  'movie_id', 'user_id', 'customer_name', 'customer_email',
  'phone', 'seats', 'total_price', 'status', 'booking_date'
];

const BOOKING_FIELDS = [
  'id', 'movie_id', 'user_id', 'customer_name', 'customer_email',
  'phone', 'seats', 'total_price', 'status', 'booking_date', 'created_at'
];

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

function validateBookingFields(body, isUpdate = false) {
  const errors = [];

  if (!isUpdate) {
    if (!body.movie_id) {
      errors.push('movie_id is required');
    } else {
      const mid = Number(body.movie_id);
      if (isNaN(mid) || !Number.isInteger(mid) || mid < 1) {
        errors.push('movie_id must be a valid positive integer');
      }
    }

    if (!body.customer_name || typeof body.customer_name !== 'string' || body.customer_name.trim() === '') {
      errors.push('customer_name is required and must be a non-empty string');
    }

    if (!body.customer_email || typeof body.customer_email !== 'string' || body.customer_email.trim() === '') {
      errors.push('customer_email is required and must be a non-empty string');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customer_email.trim())) {
      errors.push('customer_email must be a valid email address');
    }
  } else {
    if (body.movie_id !== undefined) {
      const mid = Number(body.movie_id);
      if (isNaN(mid) || !Number.isInteger(mid) || mid < 1) {
        errors.push('movie_id must be a valid positive integer');
      }
    }

    if (body.customer_name !== undefined && (typeof body.customer_name !== 'string' || body.customer_name.trim() === '')) {
      errors.push('customer_name must be a non-empty string');
    }

    if (body.customer_email !== undefined) {
      if (typeof body.customer_email !== 'string' || body.customer_email.trim() === '') {
        errors.push('customer_email must be a non-empty string');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.customer_email.trim())) {
        errors.push('customer_email must be a valid email address');
      }
    }
  }

  if (body.seats !== undefined && body.seats !== null) {
    const s = Number(body.seats);
    if (isNaN(s) || !Number.isInteger(s) || s < 1) {
      errors.push('seats must be a positive integer');
    }
  }

  if (body.total_price !== undefined && body.total_price !== null) {
    const p = Number(body.total_price);
    if (isNaN(p) || p < 0) {
      errors.push('total_price must be a non-negative number');
    }
  }

  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
    errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (body.booking_date !== undefined && body.booking_date !== null) {
    const d = new Date(body.booking_date);
    if (isNaN(d.getTime())) {
      errors.push('booking_date must be a valid date');
    }
  }

  return errors;
}

function filterFields(body, allowed) {
  const filtered = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      filtered[key] = body[key];
    }
  }
  return filtered;
}

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(BOOKING_FIELDS.join(', '))
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', details: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }
    const { data, error } = await supabase
      .from('bookings')
      .select(BOOKING_FIELDS.join(', '))
      .eq('id', id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Booking not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking', details: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const validationErrors = validateBookingFields(req.body, false);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    const bookingData = filterFields(req.body, ALLOWED_BOOKING_FIELDS);
    if (bookingData.customer_name) bookingData.customer_name = bookingData.customer_name.trim();
    if (bookingData.customer_email) bookingData.customer_email = bookingData.customer_email.trim().toLowerCase();
    if (bookingData.phone) bookingData.phone = bookingData.phone.trim();

    if (!bookingData.status) bookingData.status = 'pending';
    if (!bookingData.seats) bookingData.seats = 1;

    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select(BOOKING_FIELDS.join(', '));
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking', details: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }

    const validationErrors = validateBookingFields(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    const bookingData = filterFields(req.body, ALLOWED_BOOKING_FIELDS);
    if (Object.keys(bookingData).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    if (bookingData.customer_name) bookingData.customer_name = bookingData.customer_name.trim();
    if (bookingData.customer_email) bookingData.customer_email = bookingData.customer_email.trim().toLowerCase();
    if (bookingData.phone) bookingData.phone = bookingData.phone.trim();

    const { data, error } = await supabase
      .from('bookings')
      .update(bookingData)
      .eq('id', id)
      .select(BOOKING_FIELDS.join(', '));
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid booking ID' });
    }
    const { data, error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)
      .select('id');
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete booking', details: err.message });
  }
});

module.exports = router;
