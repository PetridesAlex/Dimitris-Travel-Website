-- Optional demo seed for Supabase (run after migration)
-- Prefer apps/web demo mode until Supabase is connected.

INSERT INTO site_settings (key, value) VALUES
  ('brand', '{"name":"Uncharted Journeys","phone":"+44 20 7946 0100","email":"journeys@uncharted.example"}'::jsonb),
  ('features', '{"newsletter":true,"blog":true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO seo_defaults (locale, title_template, default_meta_description)
VALUES ('en', '%s | Uncharted Journeys', 'Tailor-made luxury journeys around the world.')
ON CONFLICT (locale) DO NOTHING;

INSERT INTO navigation_menus (key, label) VALUES ('primary', 'Primary')
ON CONFLICT (key) DO NOTHING;
