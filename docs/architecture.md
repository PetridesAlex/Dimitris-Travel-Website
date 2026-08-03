# Luxury Travel CMS — Architecture

See the approved plan for full system design.

## Quick start

```bash
cp .env.example apps/web/.env.local
cd apps/web && npm install && npm run dev
```

- Public site: http://localhost:3000/en
- CMS: http://localhost:3000/admin (demo login accepts any credentials)
- Sitemap: http://localhost:3000/sitemap.xml

## Supabase

1. Create a project
2. Run `supabase/migrations/20260303210000_initial_schema.sql`
3. Create public Storage bucket `media`
4. Set env vars and set `USE_DEMO_DATA=false`

## Packages

- `apps/web` — Next.js 15 App Router (public + admin)
- `packages/shared` — roles, locales, permissions
- `packages/config` — brand tokens
- `packages/database` — generated/typed schema helpers
- `supabase/migrations` — Postgres schema + RLS

## i18n

Locales: en, el, de, fr, it, es, ar (RTL). Content translations live in DB tables; UI chrome uses message JSON.
