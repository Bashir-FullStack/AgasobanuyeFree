const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const supabase = require('../supabase');

const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
});
const { createNotification } = require('../notifications');

const ALLOWED_MOVIE_FIELDS = [
  'title', 'description', 'poster', 'image', 'backdrop', 'banner', 'thumbnail',
  'video_url', 'year', 'duration', 'rating', 'badge', 'episode',
  'type', 'interpreter', 'genre', 'genres', 'price', 'featured', 'uploader',
  'progress', 'cast', 'director', 'trailer_url'
];

const MOVIE_FIELDS = [
  'id', 'title', 'description', 'poster', 'image', 'backdrop', 'banner',
  'thumbnail', 'video_url', 'year', 'duration', 'rating',
  'badge', 'episode', 'type', 'interpreter', 'genre', 'genres', 'price',
  'featured', 'uploader', 'progress', 'cast', 'director', 'trailer_url',
  'created_at', 'updated_at'
];

function validateMovieFields(body, isUpdate = false) {
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

  if (body.year !== undefined && body.year !== null && body.year !== '') {
    const y = Number(body.year);
    if (isNaN(y) || !Number.isInteger(y) || y < 1888 || y > 2100) {
      errors.push('year must be an integer between 1888 and 2100');
    }
  }

  if (body.duration !== undefined && body.duration !== null && body.duration !== '') {
    const d = Number(body.duration);
    if (isNaN(d) || !Number.isInteger(d) || d < 0) {
      errors.push('duration must be a non-negative integer');
    }
  }

  if (body.rating !== undefined && body.rating !== null && body.rating !== '') {
    const r = Number(body.rating);
    if (isNaN(r) || r < 0 || r > 10) {
      errors.push('rating must be a number between 0 and 10');
    }
  }

  if (body.price !== undefined && body.price !== null && body.price !== '') {
    const p = Number(body.price);
    if (isNaN(p) || p < 0) {
      errors.push('price must be a non-negative number');
    }
  }

  if (body.genres !== undefined && !Array.isArray(body.genres)) {
    errors.push('genres must be an array');
  }

  if (body.featured !== undefined && typeof body.featured !== 'boolean') {
    errors.push('featured must be a boolean');
  }

  return errors;
}

function filterFields(body, allowed) {
  const filtered = {};
  for (const key of allowed) {
    if (body[key] !== undefined && body[key] !== '') {
      filtered[key] = body[key];
    }
  }
  return filtered;
}

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select(MOVIE_FIELDS.join(', '));
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movies', details: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }
    const { data, error } = await supabase
      .from('movies')
      .select(MOVIE_FIELDS.join(', '))
      .eq('id', id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Movie not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movie', details: err.message });
  }
});

router.post('/', upload.fields([
  { name: 'poster_file', maxCount: 1 },
  { name: 'video_file', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]), async (req, res) => {
  try {
    if (req.body.featured === 'true') req.body.featured = true;
    else if (req.body.featured === 'false') req.body.featured = false;

    const validationErrors = validateMovieFields(req.body, false);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    const movieData = filterFields(req.body, ALLOWED_MOVIE_FIELDS);

    if (req.files) {
      if (req.files.poster_file?.[0]) movieData.poster = '/uploads/' + req.files.poster_file[0].filename;
      if (req.files.video_file?.[0]) movieData.video_url = '/uploads/' + req.files.video_file[0].filename;
      if (req.files.image?.[0]) movieData.image = '/uploads/' + req.files.image[0].filename;
      if (req.files.banner?.[0]) movieData.banner = '/uploads/' + req.files.banner[0].filename;
      if (req.files.video?.[0]) movieData.video_url = '/uploads/' + req.files.video[0].filename;
    }

    movieData.title = movieData.title.trim();
    if (movieData.description) movieData.description = movieData.description.trim();

    const { data, error } = await supabase
      .from('movies')
      .insert(movieData)
      .select(MOVIE_FIELDS.join(', '));
    if (error) throw error;

    createNotification({
      message: `New movie: ${movieData.title} has been added!`,
      type: 'movie_added',
      movie_id: data[0].id,
    });

    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create movie', details: err.message });
  }
});

router.put('/:id', upload.fields([
  { name: 'poster_file', maxCount: 1 },
  { name: 'video_file', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }

    // Type coercion for multipart/form-data (everything is a string)
    if (req.body.featured === 'true') req.body.featured = true;
    else if (req.body.featured === 'false') req.body.featured = false;

    const validationErrors = validateMovieFields(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    const movieData = filterFields(req.body, ALLOWED_MOVIE_FIELDS);

    // Handle file uploads
    if (req.files) {
      if (req.files.poster_file?.[0]) movieData.poster = '/uploads/' + req.files.poster_file[0].filename;
      if (req.files.video_file?.[0]) movieData.video_url = '/uploads/' + req.files.video_file[0].filename;
      if (req.files.image?.[0]) movieData.image = '/uploads/' + req.files.image[0].filename;
      if (req.files.banner?.[0]) movieData.banner = '/uploads/' + req.files.banner[0].filename;
      if (req.files.video?.[0]) movieData.video_url = '/uploads/' + req.files.video[0].filename;
    }

    if (Object.keys(movieData).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    if (movieData.title) movieData.title = movieData.title.trim();
    if (movieData.description) movieData.description = movieData.description.trim();

    const { data, error } = await supabase
      .from('movies')
      .update(movieData)
      .eq('id', id)
      .select(MOVIE_FIELDS.join(', '));
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Movie not found' });
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update movie', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }
    const { data, error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id)
      .select('id');
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Movie not found' });
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete movie', details: err.message });
  }
});

module.exports = router;
