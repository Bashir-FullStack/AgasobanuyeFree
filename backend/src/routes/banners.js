const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

const ALLOWED_BANNER_FIELDS = [
  'title', 'subtitle', 'description', 'image', 'backdrop',
  'link', 'secondary_link', 'active', 'is_featured'
];

const BANNER_FIELDS = [
  'id', 'title', 'subtitle', 'description', 'image', 'backdrop',
  'link', 'secondary_link', 'active', 'is_featured', 'created_at'
];

function validateBannerFields(body, isUpdate = false) {
  const errors = [];

  if (!isUpdate) {
    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      errors.push('title is required and must be a non-empty string');
    }
  } else {
    if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim() === '')) {
      errors.push('title must be a non-empty string');
    }
  }

  if (body.active !== undefined && typeof body.active !== 'boolean') {
    errors.push('active must be a boolean');
  }

  if (body.is_featured !== undefined && typeof body.is_featured !== 'boolean') {
    errors.push('is_featured must be a boolean');
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
      .from('banners')
      .select(BANNER_FIELDS.join(', '))
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banners', details: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid banner ID' });
    }
    const { data, error } = await supabase
      .from('banners')
      .select(BANNER_FIELDS.join(', '))
      .eq('id', id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Banner not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banner', details: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const validationErrors = validateBannerFields(req.body, false);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    const bannerData = filterFields(req.body, ALLOWED_BANNER_FIELDS);
    bannerData.title = bannerData.title.trim();
    if (bannerData.subtitle) bannerData.subtitle = bannerData.subtitle.trim();
    if (bannerData.description) bannerData.description = bannerData.description.trim();

    const { data, error } = await supabase
      .from('banners')
      .insert(bannerData)
      .select(BANNER_FIELDS.join(', '));
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create banner', details: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid banner ID' });
    }

    const validationErrors = validateBannerFields(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    const bannerData = filterFields(req.body, ALLOWED_BANNER_FIELDS);
    if (Object.keys(bannerData).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    if (bannerData.title) bannerData.title = bannerData.title.trim();
    if (bannerData.subtitle) bannerData.subtitle = bannerData.subtitle.trim();
    if (bannerData.description) bannerData.description = bannerData.description.trim();

    const { data, error } = await supabase
      .from('banners')
      .update(bannerData)
      .eq('id', id)
      .select(BANNER_FIELDS.join(', '));
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Banner not found' });
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update banner', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid banner ID' });
    }
    const { data, error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id)
      .select('id');
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Banner not found' });
    res.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete banner', details: err.message });
  }
});

module.exports = router;
