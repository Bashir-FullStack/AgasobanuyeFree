-- ============================================================
-- Agasobanuye Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Movies
CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  poster TEXT,
  image TEXT,
  backdrop TEXT,
  banner TEXT,
  thumbnail TEXT,
  video_url TEXT,
  year INTEGER,
  duration INTEGER,
  rating DECIMAL(3,1),
  badge TEXT,
  episode TEXT,
  type TEXT DEFAULT 'Movie',
  interpreter TEXT DEFAULT 'Sankara',
  genre TEXT,
  genres TEXT[] DEFAULT '{}',
  price DECIMAL(10,2),
  featured BOOLEAN DEFAULT FALSE,
  uploader TEXT DEFAULT 'Sankara',
  progress INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banners (Hero slides)
CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image TEXT,
  backdrop TEXT,
  link TEXT,
  secondary_link TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Genres
CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Studios
CREATE TABLE studios (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Theaters
CREATE TABLE theaters (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  city TEXT,
  capacity INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  user_id TEXT,
  customer_name TEXT,
  customer_email TEXT,
  phone TEXT,
  seats INTEGER DEFAULT 1,
  total_price DECIMAL(10,2),
  status TEXT DEFAULT 'pending',
  booking_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  user_id TEXT,
  user_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (Admin)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'user',
  avatar TEXT,
  google_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promos / Coupons
CREATE TABLE promos (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount DECIMAL(5,2),
  type TEXT DEFAULT 'percentage',
  active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Announcements
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title TEXT,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscribers (newsletter)
CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- News
CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image TEXT,
  author TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Web Settings
CREATE TABLE web_settings (
  id SERIAL PRIMARY KEY,
  section TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@agasobanuye.com', '$2a$10$dummy_hash_for_demo', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample genres
INSERT INTO genres (name) VALUES
  ('Action'), ('Adventure'), ('Animation'), ('Comedy'), ('Crime'),
  ('Documentary'), ('Drama'), ('Fantasy'), ('Horror'), ('Mystery'),
  ('Romance'), ('Sci-Fi'), ('Thriller'), ('War'), ('Western')
ON CONFLICT (name) DO NOTHING;

-- Insert default web settings
INSERT INTO web_settings (section, data) VALUES
  ('branding', '{"logo": "AgasobanuyeFREE", "favicon": "", "primaryColor": "#ff1e1e"}'),
  ('general', '{"siteName": "Agasobanuye", "description": "Stream Movies & TV Shows", "language": "en"}')
ON CONFLICT (section) DO NOTHING;
