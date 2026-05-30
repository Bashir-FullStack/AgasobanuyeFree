const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
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

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret_change_me';
const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

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
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const compareRoutes = require('./routes/compare');
const ordersRoutes = require('./routes/orders');
const addressesRoutes = require('./routes/addresses');
const deliveryRoutes = require('./routes/delivery');
const paymentsRoutes = require('./routes/payments');
const couponsRoutes = require('./routes/coupons');
const profileRoutes = require('./routes/profile');
const subscribeRoutes = require('./routes/subscribe');
const { getNotifications, createNotification, markAsRead } = require('./notifications');

const app = express();
const PORT = process.env.PORT || 4000;

// Security headers
app.use(helmet());

// CORS
app.use(cors({
  origin: CORS_ORIGINS,
  credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Rate limit auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// Validation rules for POST/PUT
const movieValidation = [
  body('name').optional().isString().trim().notEmpty(),
  body('description').optional().isString(),
  body('genre').optional().isString(),
  body('price').optional().isFloat({ min: 0 }),
  body('rating').optional().isFloat({ min: 0, max: 10 }),
];

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

function userAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - no token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - no token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden - admin access required' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

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
app.use('/api/cart', userAuth, cartRoutes);
app.use('/api/wishlist', userAuth, wishlistRoutes);
app.use('/api/compare', userAuth, compareRoutes);
app.use('/api/orders', userAuth, ordersRoutes);
app.use('/api/addresses', userAuth, addressesRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/payment', paymentsRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/auth', profileRoutes);
app.use('/api/subscribe', subscribeRoutes);

const supabase = require('./supabase');

app.get('/api/admin/dashboard', adminMiddleware, async (req, res, next) => {
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
    next(err);
  }
});

app.get('/api/admin/movies', adminMiddleware, async (req, res, next) => {
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
    next(err);
  }
});

app.post('/api/admin/movies', adminMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'images', maxCount: 10 },
]), movieValidation, validate, async (req, res, next) => {
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
    next(err);
  }
});

app.put('/api/admin/movies/:id', adminMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'banner', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]), movieValidation, validate, async (req, res, next) => {
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
    next(err);
  }
});

app.get('/api/settings', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('web_settings')
      .select('section, data');
    if (error) throw error;
    const settings = {};
    (data || []).forEach(s => { settings[s.section] = s.data; });
    res.json(settings);
  } catch (err) {
    next(err);
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/notifications', (req, res) => {
  res.json(getNotifications());
});

app.post('/api/notifications', (req, res) => {
  const { message, type, movie_id } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });
  const notif = createNotification({ message, type, movie_id });
  res.status(201).json(notif);
});

app.patch('/api/notifications/read', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids must be an array' });
  markAsRead(ids);
  res.json({ success: true });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
