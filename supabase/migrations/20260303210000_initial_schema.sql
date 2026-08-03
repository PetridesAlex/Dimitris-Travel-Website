-- Luxury Travel CMS — Initial Schema
-- Single-tenant v1, tenant_id-ready structure

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ───────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM (
  'super_admin',
  'admin',
  'editor',
  'content_writer',
  'marketing'
);

CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');

CREATE TYPE destination_type AS ENUM ('continent', 'country', 'city');

CREATE TYPE enquiry_status AS ENUM (
  'new',
  'contacted',
  'qualified',
  'won',
  'lost'
);

CREATE TYPE experience_category AS ENUM (
  'safari',
  'luxury_cruises',
  'private_villas',
  'private_jet',
  'luxury_train',
  'honeymoon',
  'adventure',
  'wellness',
  'family',
  'golf',
  'food_wine',
  'culture',
  'photography',
  'diving',
  'yachting',
  'luxury_escapes'
);

CREATE TYPE collection_item_type AS ENUM (
  'destination',
  'hotel',
  'experience',
  'itinerary'
);

CREATE TYPE faq_entity_type AS ENUM (
  'global',
  'destination',
  'hotel',
  'experience',
  'itinerary'
);

-- ─── Profiles & RBAC ─────────────────────────────────────────────────────────

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'content_writer',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  UNIQUE (resource, action)
);

CREATE TABLE role_permissions (
  role user_role NOT NULL,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role, permission_id)
);

-- ─── Media Library ───────────────────────────────────────────────────────────

CREATE TABLE media_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  parent_id UUID REFERENCES media_folders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (parent_id, slug)
);

CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id UUID REFERENCES media_folders(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
  width INT,
  height INT,
  size_bytes BIGINT,
  alt TEXT DEFAULT '',
  title TEXT DEFAULT '',
  blurhash TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE media_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  alt TEXT DEFAULT '',
  title TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  UNIQUE (media_id, locale)
);

-- ─── Destinations ────────────────────────────────────────────────────────────

CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type destination_type NOT NULL,
  parent_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  slug_path TEXT NOT NULL UNIQUE,
  status content_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  hero_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  cover_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  video_url TEXT,
  map_embed TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE TABLE destination_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  overview TEXT DEFAULT '',
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  best_time_to_visit TEXT DEFAULT '',
  weather TEXT DEFAULT '',
  visa_info TEXT DEFAULT '',
  currency TEXT DEFAULT '',
  languages TEXT DEFAULT '',
  timezone TEXT DEFAULT '',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  og_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  canonical_path TEXT,
  UNIQUE (destination_id, locale)
);

CREATE TABLE destination_relations (
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  related_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (destination_id, related_id),
  CHECK (destination_id <> related_id)
);

CREATE TABLE destination_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0
);

-- ─── Hotels ──────────────────────────────────────────────────────────────────

CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  status content_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  star_rating NUMERIC(2,1) CHECK (star_rating >= 0 AND star_rating <= 5),
  website TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
  rooms JSONB NOT NULL DEFAULT '[]'::jsonb,
  restaurants JSONB NOT NULL DEFAULT '[]'::jsonb,
  spa JSONB NOT NULL DEFAULT '{}'::jsonb,
  hero_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE hotel_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  name TEXT NOT NULL,
  location_label TEXT DEFAULT '',
  description TEXT DEFAULT '',
  nearby_attractions JSONB NOT NULL DEFAULT '[]'::jsonb,
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  og_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  UNIQUE (hotel_id, locale)
);

CREATE TABLE hotel_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE destination_hotels (
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (destination_id, hotel_id)
);

-- ─── Experiences ─────────────────────────────────────────────────────────────

CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  category experience_category NOT NULL DEFAULT 'culture',
  status content_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  packages JSONB NOT NULL DEFAULT '[]'::jsonb,
  hero_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE experience_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  og_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  UNIQUE (experience_id, locale)
);

CREATE TABLE experience_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE destination_experiences (
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (destination_id, experience_id)
);

CREATE TABLE experience_hotels (
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  PRIMARY KEY (experience_id, hotel_id)
);

-- ─── Collections ─────────────────────────────────────────────────────────────

CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  status content_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  hero_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE collection_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  name TEXT NOT NULL,
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  og_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  UNIQUE (collection_id, locale)
);

CREATE TABLE collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  item_type collection_item_type NOT NULL,
  item_id UUID NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- ─── Itineraries ─────────────────────────────────────────────────────────────

CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  status content_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  duration_days INT NOT NULL DEFAULT 7,
  price_from NUMERIC(12,2),
  currency TEXT NOT NULL DEFAULT 'EUR',
  included JSONB NOT NULL DEFAULT '[]'::jsonb,
  excluded JSONB NOT NULL DEFAULT '[]'::jsonb,
  hero_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  map_embed TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE itinerary_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  summary TEXT DEFAULT '',
  description TEXT DEFAULT '',
  cities_label TEXT DEFAULT '',
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  og_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  UNIQUE (itinerary_id, locale)
);

CREATE TABLE itinerary_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE (itinerary_id, day_number)
);

CREATE TABLE itinerary_day_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  body TEXT DEFAULT '',
  UNIQUE (day_id, locale)
);

CREATE TABLE itinerary_destinations (
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (itinerary_id, destination_id)
);

CREATE TABLE itinerary_hotels (
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  PRIMARY KEY (itinerary_id, hotel_id)
);

CREATE TABLE itinerary_experiences (
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  experience_id UUID NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
  PRIMARY KEY (itinerary_id, experience_id)
);

CREATE TABLE destination_itineraries (
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (destination_id, itinerary_id)
);

-- ─── Pages / Navigation / Settings ───────────────────────────────────────────

CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  status content_status NOT NULL DEFAULT 'draft',
  template TEXT NOT NULL DEFAULT 'default',
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE page_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  og_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  UNIQUE (page_id, locale)
);

CREATE TABLE navigation_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL
);

CREATE TABLE navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id UUID NOT NULL REFERENCES navigation_menus(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
  href TEXT NOT NULL DEFAULT '/',
  sort_order INT NOT NULL DEFAULT 0,
  is_external BOOLEAN NOT NULL DEFAULT false,
  open_in_new_tab BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE navigation_item_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES navigation_items(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  label TEXT NOT NULL,
  UNIQUE (item_id, locale)
);

CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE footer_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL DEFAULT 'en' UNIQUE,
  tagline TEXT DEFAULT '',
  columns JSONB NOT NULL DEFAULT '[]'::jsonb,
  copyright TEXT DEFAULT '',
  social_links JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- ─── Blog ────────────────────────────────────────────────────────────────────

CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE blog_category_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  UNIQUE (category_id, locale)
);

CREATE TABLE blog_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  avatar_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  status content_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  author_id UUID REFERENCES blog_authors(id) ON DELETE SET NULL,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  cover_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE blog_post_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  body JSONB NOT NULL DEFAULT '[]'::jsonb,
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  og_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  UNIQUE (post_id, locale)
);

-- ─── Testimonials / FAQs ─────────────────────────────────────────────────────

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status content_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC(2,1) DEFAULT 5,
  avatar_media_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE testimonial_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  testimonial_id UUID NOT NULL REFERENCES testimonials(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  author_name TEXT NOT NULL,
  author_location TEXT DEFAULT '',
  quote TEXT NOT NULL,
  trip_label TEXT DEFAULT '',
  UNIQUE (testimonial_id, locale)
);

CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type faq_entity_type NOT NULL DEFAULT 'global',
  entity_id UUID,
  status content_status NOT NULL DEFAULT 'published',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE faq_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faq_id UUID NOT NULL REFERENCES faqs(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  UNIQUE (faq_id, locale)
);

-- ─── Enquiries / Newsletter ──────────────────────────────────────────────────

CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  travel_date DATE,
  budget TEXT,
  adults INT NOT NULL DEFAULT 2,
  children INT NOT NULL DEFAULT 0,
  travel_style TEXT,
  notes TEXT,
  status enquiry_status NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  utm JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE enquiry_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  locale TEXT NOT NULL DEFAULT 'en',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── SEO ─────────────────────────────────────────────────────────────────────

CREATE TABLE redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path TEXT NOT NULL UNIQUE,
  to_path TEXT NOT NULL,
  status_code INT NOT NULL DEFAULT 301,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE seo_defaults (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL UNIQUE DEFAULT 'en',
  title_template TEXT NOT NULL DEFAULT '%s | Uncharted Journeys',
  default_meta_description TEXT DEFAULT '',
  default_og_image_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  organization_jsonld JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX idx_destinations_parent ON destinations(parent_id);
CREATE INDEX idx_destinations_type_status ON destinations(type, status);
CREATE INDEX idx_destinations_featured ON destinations(featured) WHERE featured = true;
CREATE INDEX idx_hotels_status ON hotels(status);
CREATE INDEX idx_experiences_category ON experiences(category, status);
CREATE INDEX idx_itineraries_status ON itineraries(status);
CREATE INDEX idx_blog_posts_status ON blog_posts(status, published_at DESC);
CREATE INDEX idx_enquiries_status ON enquiries(status, created_at DESC);
CREATE INDEX idx_enquiries_assigned ON enquiries(assigned_to);
CREATE INDEX idx_media_folder ON media_assets(folder_id);
CREATE INDEX idx_destination_translations_locale ON destination_translations(locale);
CREATE INDEX idx_pages_slug ON pages(slug);

-- ─── updated_at trigger ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_destinations_updated BEFORE UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_hotels_updated BEFORE UPDATE ON hotels
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_experiences_updated BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_collections_updated BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_itineraries_updated BEFORE UPDATE ON itineraries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_pages_updated BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_enquiries_updated BEFORE UPDATE ON enquiries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_media_updated BEFORE UPDATE ON media_assets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Profile bootstrap on signup ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'content_writer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Seed permissions ────────────────────────────────────────────────────────

INSERT INTO permissions (resource, action, description) VALUES
  ('users', 'manage', 'Manage users and roles'),
  ('settings', 'manage', 'Manage site settings, nav, footer'),
  ('content', 'create', 'Create content'),
  ('content', 'edit', 'Edit content'),
  ('content', 'publish', 'Publish content'),
  ('content', 'delete', 'Delete content'),
  ('media', 'upload', 'Upload media'),
  ('media', 'delete', 'Delete media'),
  ('blog', 'manage', 'Manage blog'),
  ('enquiries', 'view', 'View enquiries'),
  ('enquiries', 'assign', 'Assign enquiries'),
  ('enquiries', 'export', 'Export enquiries CSV'),
  ('seo', 'manage', 'Manage SEO globals and redirects');

-- Super admin: all
INSERT INTO role_permissions (role, permission_id)
SELECT 'super_admin', id FROM permissions;

-- Admin: all except users.manage
INSERT INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions WHERE NOT (resource = 'users' AND action = 'manage');

-- Editor: create/edit/publish, media upload, blog, enquiries view
INSERT INTO role_permissions (role, permission_id)
SELECT 'editor', id FROM permissions
WHERE (resource, action) IN (
  ('content','create'),('content','edit'),('content','publish'),
  ('media','upload'),('blog','manage'),('enquiries','view'),('seo','manage')
);

-- Content writer: create/edit drafts, media upload, blog
INSERT INTO role_permissions (role, permission_id)
SELECT 'content_writer', id FROM permissions
WHERE (resource, action) IN (
  ('content','create'),('content','edit'),('media','upload'),('blog','manage')
);

-- Marketing: blog, media upload, seo, enquiries view
INSERT INTO role_permissions (role, permission_id)
SELECT 'marketing', id FROM permissions
WHERE (resource, action) IN (
  ('blog','manage'),('media','upload'),('seo','manage'),('enquiries','view')
);

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonial_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_defaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.has_permission(p_resource TEXT, p_action TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles pr
    JOIN public.role_permissions rp ON rp.role = pr.role
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE pr.id = auth.uid()
      AND pr.is_active = true
      AND p.resource = p_resource
      AND p.action = p_action
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Public read published content
CREATE POLICY "Public read published destinations" ON destinations
  FOR SELECT USING (status = 'published' OR has_permission('content','edit'));

CREATE POLICY "Public read destination translations" ON destination_translations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM destinations d
      WHERE d.id = destination_id
        AND (d.status = 'published' OR has_permission('content','edit'))
    )
  );

CREATE POLICY "Staff manage destinations" ON destinations
  FOR ALL USING (has_permission('content','edit'))
  WITH CHECK (has_permission('content','create') OR has_permission('content','edit'));

CREATE POLICY "Public read published hotels" ON hotels
  FOR SELECT USING (status = 'published' OR has_permission('content','edit'));
CREATE POLICY "Staff manage hotels" ON hotels
  FOR ALL USING (has_permission('content','edit'))
  WITH CHECK (has_permission('content','edit'));

CREATE POLICY "Public read hotel translations" ON hotel_translations
  FOR SELECT USING (true);

CREATE POLICY "Public read published experiences" ON experiences
  FOR SELECT USING (status = 'published' OR has_permission('content','edit'));
CREATE POLICY "Staff manage experiences" ON experiences
  FOR ALL USING (has_permission('content','edit'))
  WITH CHECK (has_permission('content','edit'));
CREATE POLICY "Public read experience translations" ON experience_translations
  FOR SELECT USING (true);

CREATE POLICY "Public read published collections" ON collections
  FOR SELECT USING (status = 'published' OR has_permission('content','edit'));
CREATE POLICY "Staff manage collections" ON collections
  FOR ALL USING (has_permission('content','edit'))
  WITH CHECK (has_permission('content','edit'));
CREATE POLICY "Public read collection translations" ON collection_translations
  FOR SELECT USING (true);

CREATE POLICY "Public read published itineraries" ON itineraries
  FOR SELECT USING (status = 'published' OR has_permission('content','edit'));
CREATE POLICY "Staff manage itineraries" ON itineraries
  FOR ALL USING (has_permission('content','edit'))
  WITH CHECK (has_permission('content','edit'));
CREATE POLICY "Public read itinerary translations" ON itinerary_translations
  FOR SELECT USING (true);

CREATE POLICY "Public read published pages" ON pages
  FOR SELECT USING (status = 'published' OR has_permission('content','edit'));
CREATE POLICY "Staff manage pages" ON pages
  FOR ALL USING (has_permission('content','edit') OR has_permission('settings','manage'))
  WITH CHECK (has_permission('settings','manage') OR has_permission('content','edit'));
CREATE POLICY "Public read page translations" ON page_translations FOR SELECT USING (true);

CREATE POLICY "Public read published blog" ON blog_posts
  FOR SELECT USING (status = 'published' OR has_permission('blog','manage'));
CREATE POLICY "Staff manage blog" ON blog_posts
  FOR ALL USING (has_permission('blog','manage'))
  WITH CHECK (has_permission('blog','manage'));
CREATE POLICY "Public read blog translations" ON blog_post_translations FOR SELECT USING (true);

CREATE POLICY "Public read testimonials" ON testimonials
  FOR SELECT USING (status = 'published' OR has_permission('content','edit'));
CREATE POLICY "Staff manage testimonials" ON testimonials
  FOR ALL USING (has_permission('content','edit'))
  WITH CHECK (has_permission('content','edit'));
CREATE POLICY "Public read testimonial translations" ON testimonial_translations FOR SELECT USING (true);

CREATE POLICY "Public read faqs" ON faqs
  FOR SELECT USING (status = 'published' OR has_permission('content','edit'));
CREATE POLICY "Staff manage faqs" ON faqs
  FOR ALL USING (has_permission('content','edit'))
  WITH CHECK (has_permission('content','edit'));
CREATE POLICY "Public read faq translations" ON faq_translations FOR SELECT USING (true);

CREATE POLICY "Anyone insert enquiries" ON enquiries
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff view enquiries" ON enquiries
  FOR SELECT USING (has_permission('enquiries','view'));
CREATE POLICY "Staff update enquiries" ON enquiries
  FOR UPDATE USING (has_permission('enquiries','assign') OR has_permission('enquiries','view'));

CREATE POLICY "Staff enquiry notes" ON enquiry_notes
  FOR ALL USING (has_permission('enquiries','view'))
  WITH CHECK (has_permission('enquiries','view'));

CREATE POLICY "Public read media" ON media_assets FOR SELECT USING (true);
CREATE POLICY "Staff upload media" ON media_assets
  FOR INSERT WITH CHECK (has_permission('media','upload'));
CREATE POLICY "Staff update media" ON media_assets
  FOR UPDATE USING (has_permission('media','upload'));
CREATE POLICY "Staff delete media" ON media_assets
  FOR DELETE USING (has_permission('media','delete'));

CREATE POLICY "Public read folders" ON media_folders FOR SELECT USING (true);
CREATE POLICY "Staff manage folders" ON media_folders
  FOR ALL USING (has_permission('media','upload'))
  WITH CHECK (has_permission('media','upload'));

CREATE POLICY "Anyone subscribe newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff read subscribers" ON newsletter_subscribers
  FOR SELECT USING (has_permission('settings','manage'));

CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON site_settings
  FOR ALL USING (has_permission('settings','manage'))
  WITH CHECK (has_permission('settings','manage'));

CREATE POLICY "Public read nav menus" ON navigation_menus FOR SELECT USING (true);
CREATE POLICY "Admin manage nav menus" ON navigation_menus
  FOR ALL USING (has_permission('settings','manage'))
  WITH CHECK (has_permission('settings','manage'));

CREATE POLICY "Public read nav items" ON navigation_items FOR SELECT USING (true);
CREATE POLICY "Admin manage nav items" ON navigation_items
  FOR ALL USING (has_permission('settings','manage'))
  WITH CHECK (has_permission('settings','manage'));

CREATE POLICY "Public read footer" ON footer_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage footer" ON footer_settings
  FOR ALL USING (has_permission('settings','manage'))
  WITH CHECK (has_permission('settings','manage'));

CREATE POLICY "Public read redirects" ON redirects FOR SELECT USING (is_active = true);
CREATE POLICY "SEO manage redirects" ON redirects
  FOR ALL USING (has_permission('seo','manage'))
  WITH CHECK (has_permission('seo','manage'));

CREATE POLICY "Public read seo defaults" ON seo_defaults FOR SELECT USING (true);
CREATE POLICY "SEO manage defaults" ON seo_defaults
  FOR ALL USING (has_permission('seo','manage'))
  WITH CHECK (has_permission('seo','manage'));

CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR has_permission('users','manage'));
CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id OR has_permission('users','manage'));

-- Storage bucket (run in dashboard or via API): media
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
