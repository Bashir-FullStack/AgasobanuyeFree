const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

const ALLOWED_MOVIE_FIELDS = [
  'title', 'description', 'poster', 'image', 'backdrop', 'banner', 'thumbnail',
  'video_url', 'trailer_url', 'year', 'duration', 'rating', 'badge', 'episode',
  'type', 'interpreter', 'genre', 'genres', 'price', 'featured', 'uploader',
  'progress', 'interpreter_id', 'category_id', 'language', 'country', 'views'
];

const MOVIE_FIELDS = [
  'id', 'title', 'description', 'poster', 'image', 'backdrop', 'banner',
  'thumbnail', 'video_url', 'trailer_url', 'year', 'duration', 'rating',
  'badge', 'episode', 'type', 'interpreter', 'genre', 'genres', 'price',
  'featured', 'uploader', 'progress', 'interpreter_id', 'category_id',
  'language', 'country', 'views', 'created_at', 'updated_at'
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

  if (body.year !== undefined && body.year !== null) {
    const y = Number(body.year);
    if (isNaN(y) || !Number.isInteger(y) || y < 1888 || y > 2100) {
      errors.push('year must be an integer between 1888 and 2100');
    }
  }

  if (body.duration !== undefined && body.duration !== null) {
    const d = Number(body.duration);
    if (isNaN(d) || !Number.isInteger(d) || d < 0) {
      errors.push('duration must be a non-negative integer');
    }
  }

  if (body.rating !== undefined && body.rating !== null) {
    const r = Number(body.rating);
    if (isNaN(r) || r < 0 || r > 10) {
      errors.push('rating must be a number between 0 and 10');
    }
  }

  if (body.price !== undefined && body.price !== null) {
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
    if (body[key] !== undefined) {
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

router.post('/', async (req, res) => {
  try {
    const validationErrors = validateMovieFields(req.body, false);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    const movieData = filterFields(req.body, ALLOWED_MOVIE_FIELDS);
    movieData.title = movieData.title.trim();
    if (movieData.description) movieData.description = movieData.description.trim();

    const { data, error } = await supabase
      .from('movies')
      .insert(movieData)
      .select(MOVIE_FIELDS.join(', '));
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create movie', details: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || !Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }

    const validationErrors = validateMovieFields(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    const movieData = filterFields(req.body, ALLOWED_MOVIE_FIELDS);
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
