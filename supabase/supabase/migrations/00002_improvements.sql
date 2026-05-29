-- Interpreters table
CREATE TABLE IF NOT EXISTS interpreters (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  bio TEXT,
  avatar TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns to movies
ALTER TABLE movies ADD COLUMN IF NOT EXISTS interpreter_id INTEGER REFERENCES interpreters(id) ON DELETE SET NULL;
ALTER TABLE movies ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE movies ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'Kinyarwanda';
ALTER TABLE movies ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Rwanda';
ALTER TABLE movies ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE movies ADD COLUMN IF NOT EXISTS trailer_url TEXT;

-- Banners improvements
ALTER TABLE banners ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Genres improvements
ALTER TABLE genres ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE genres ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE genres ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE genres ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;

-- Insert 26 interpreters
INSERT INTO interpreters (name) VALUES
  ('Sankara'),
  ('Jean Baptiste Habimana'),
  ('Emmanuel Ndagijimana'),
  ('Patrick Mugabo'),
  ('David Niyonzima'),
  ('Samuel Munyakazi'),
  ('Eric Nkusi'),
  ('Jean Pierre Hakizimana'),
  ('Jean Claude Niyibizi'),
  ('Olivier Mugabo'),
  ('Theogene Nshimiyimana'),
  ('Vedaste Nsengiyumva'),
  ('Celestin Hakizimana'),
  ('Damascene Niyonzima'),
  ('Anicet Niyonzima'),
  ('Appolinaire Niyonzima'),
  ('Bonaventure Nsengimana'),
  ('Callixte Niyonzima'),
  ('Deogratias Niyonzima'),
  ('Ephraim Niyonzima'),
  ('Faustin Niyonzima'),
  ('Gaspard Niyonzima'),
  ('Habimana Jean Marie Vianney'),
  ('Ildephonse Niyonzima'),
  ('Janvier Niyonzima'),
  ('Laurent Niyonzima')
ON CONFLICT (name) DO NOTHING;

-- Insert categories
INSERT INTO categories (name, slug, description) VALUES
  ('Action', 'action', 'Action-packed movies'),
  ('Adventure', 'adventure', 'Adventure and exploration'),
  ('Animation', 'animation', 'Animated films'),
  ('Comedy', 'comedy', 'Funny and humorous movies'),
  ('Crime', 'crime', 'Crime and mystery'),
  ('Documentary', 'documentary', 'Documentary films'),
  ('Drama', 'drama', 'Emotional and dramatic stories'),
  ('Fantasy', 'fantasy', 'Fantasy and magical worlds'),
  ('Horror', 'horror', 'Scary and horror films'),
  ('Mystery', 'mystery', 'Mystery and suspense'),
  ('Romance', 'romance', 'Romantic movies'),
  ('Sci-Fi', 'sci-fi', 'Science fiction'),
  ('Thriller', 'thriller', 'Thrilling and exciting'),
  ('War', 'war', 'War and conflict'),
  ('Western', 'western', 'Western genre')
ON CONFLICT (name) DO NOTHING;

-- Update genres with slugs
UPDATE genres SET slug = LOWER(REPLACE(name, ' ', '-')) WHERE slug IS NULL;
UPDATE genres SET display_order = id WHERE display_order = 0;
UPDATE genres SET active = TRUE WHERE active IS NULL;

-- Update movies to link Sankara as default interpreter
UPDATE movies SET interpreter_id = (SELECT id FROM interpreters WHERE name = 'Sankara' LIMIT 1) WHERE interpreter_id IS NULL;