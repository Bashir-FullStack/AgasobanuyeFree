const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)),
});
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|webm|avi|mov/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype.split('/')[1]);
    cb(null, ext || mime);
  },
});

const authRouter = require('./routes/auth');
const moviesRouter = require('./routes/movies');
const genresRouter = require('./routes/genres');
const interpretersRouter = require('./routes/interpreters');
const categoriesRouter = require('./routes/categories');
const bannersRouter = require('./routes/banners');
const bookingsRouter = require('./routes/bookings');
const usersRouter = require('./routes/users');
const promosRouter = require('./routes/promos');
const reviewsRouter = require('./routes/reviews');
const subscribersRouter = require('./routes/subscribers');

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin_token_2026';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

function authMiddleware(req, res, next) {
  if (req.path.startsWith('/api/auth')) {
    return next();
  }
  if (req.method === 'GET') {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.use(authMiddleware);

app.use('/api/auth', authRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/genres', genresRouter);
app.use('/api/interpreters', interpretersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/banners', bannersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/promos', promosRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/subscribers', subscribersRouter);

const supabase = require('./supabase');

app.get('/api/admin/dashboard', adminMiddleware, async (req, res) => {
  try {
    const [moviesResult, bookingsResult, usersResult] = await Promise.all([
      supabase.from('movies').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
    ]);

    res.json({
      stats: {
        totalMovies: moviesResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalRevenue: 0,
      },
      recentOrders: [],
      topProducts: [],
      recentActivity: [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/movies', adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('movies')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ data, total: count, page, limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/movies', adminMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]), async (req, res) => {
  try {
    const body = { ...req.body };
    const fields = { title: body.name, description: body.description, genre: body.genre, interpreter: body.interpreter, category: body.category, director: body.director, cast: body.cast, duration: body.duration, release_date: body.releaseDate, price: body.price ? parseFloat(body.price) : null, rating: body.rating ? parseFloat(body.rating) : null, trailer_url: body.trailerUrl, language: body.language, subtitle: body.subtitle, featured: body.featured === 'true', status: body.status || 'active' };

    if (req.files?.image?.[0]) fields.image = '/uploads/' + req.files.image[0].filename;
    if (req.files?.banner?.[0]) fields.banner = '/uploads/' + req.files.banner[0].filename;
    if (req.files?.video?.[0]) fields.video_url = '/uploads/' + req.files.video[0].filename;

    Object.keys(fields).forEach(k => { if (fields[k] === undefined || fields[k] === '' || fields[k] === null) delete fields[k]; });

    const { data, error } = await supabase.from('movies').insert(fields).select();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/movies/:id', adminMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]), async (req, res) => {
  try {
    const body = { ...req.body };
    const fields = {};
    if (body.name !== undefined) fields.title = body.name;
    if (body.description !== undefined) fields.description = body.description;
    if (body.genre !== undefined) fields.genre = body.genre;
    if (body.interpreter !== undefined) fields.interpreter = body.interpreter;
    if (body.category !== undefined) fields.category = body.category;
    if (body.director !== undefined) fields.director = body.director;
    if (body.cast !== undefined) fields.cast = body.cast;
    if (body.duration !== undefined) fields.duration = body.duration;
    if (body.releaseDate !== undefined) fields.release_date = body.releaseDate;
    if (body.price !== undefined) fields.price = parseFloat(body.price);
    if (body.rating !== undefined) fields.rating = parseFloat(body.rating);
    if (body.trailerUrl !== undefined) fields.trailer_url = body.trailerUrl;
    if (body.language !== undefined) fields.language = body.language;
    if (body.subtitle !== undefined) fields.subtitle = body.subtitle;
    if (body.featured !== undefined) fields.featured = body.featured === 'true';
    if (body.status !== undefined) fields.status = body.status;

    if (req.files?.image?.[0]) fields.image = '/uploads/' + req.files.image[0].filename;
    if (req.files?.banner?.[0]) fields.banner = '/uploads/' + req.files.banner[0].filename;
    if (req.files?.video?.[0]) fields.video_url = '/uploads/' + req.files.video[0].filename;

    const { data, error } = await supabase.from('movies').update(fields).eq('id', req.params.id).select();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/settings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('web_settings')
      .select('section, data');
    if (error) throw error;
    const settings = {};
    (data || []).forEach(s => { settings[s.section] = s.data; });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
