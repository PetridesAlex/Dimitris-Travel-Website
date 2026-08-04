# Uncharted Journeys — Luxury Travel Website + CMS

Enterprise-grade luxury travel platform with a custom Admin CMS on Supabase.

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Supabase · Zod · React Hook Form · Resend · Vercel

## Getting started

```bash
cp .env.example apps/web/.env.local
# Fill Supabase URL + keys, set USE_DEMO_DATA=false
npm install
npm run seed:demo   # upsert demo catalog into Supabase
npm run dev
```

| Surface | URL |
|---|---|
| Public site | http://localhost:3000/en |
| Admin CMS | http://localhost:3000/admin |
| Login | http://localhost:3000/admin/login |

### CMS login

With Supabase Auth working, use any staff user in `profiles`.

If Auth user creation fails (common until the trigger fix is applied), use the cookie fallback:

- Email: `CMS_ADMIN_EMAIL` (default `admin@uncharted.example`)
- Password: `CMS_ADMIN_PASSWORD`

### Auth trigger fix (optional but recommended)

If `signUp` / `createUser` returns “Database error creating new user”, run in Supabase → SQL Editor:

[`supabase/migrations/20260304120000_fix_auth_trigger_and_rls.sql`](supabase/migrations/20260304120000_fix_auth_trigger_and_rls.sql)

Then create a `super_admin` user in Authentication and set `profiles.role = 'super_admin'`.

## Environment

See [`.env.example`](.env.example). Required for live CMS:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY`
- `USE_DEMO_DATA=false`
- `CMS_ADMIN_EMAIL` / `CMS_ADMIN_PASSWORD` / `CMS_SESSION_SECRET`

Set the same vars in **Vercel → Project → Settings → Environment Variables**. Never commit `.env.local`.

## Features

- Cinematic marketing site
- Destination hierarchy: Continent → Country → City
- Experiences, hotels, itineraries, collections, blog
- Enquiry forms + CSV export + Resend email hooks
- Working admin CMS (create / edit / delete) backed by Supabase
- Media library (URL or Storage upload to `media` bucket)
- SEO defaults/redirects, navigation, homepage sections, settings
- Multi-language ready (EN + EL/DE/FR/IT/ES/AR)
- Sitemap, robots.txt, Open Graph, JSON-LD

## Project structure

```
apps/web/          Next.js app (public + /admin)
packages/          shared, config, database
supabase/          SQL migrations + RLS
docs/              architecture notes
```

## Vercel

This is an npm workspaces monorepo. In **Project → Settings → General**:

| Setting | Value |
|---|---|
| Root Directory | `apps/web` |
| Framework Preset | Next.js |
| Build Command | leave default / from `apps/web/vercel.json` |
| Output Directory | **leave empty** (do not set `apps/web/.next`) |
| Install Command | from `apps/web/vercel.json` (`cd ../.. && npm install`) |

Setting Output Directory to `apps/web/.next` while Root Directory is already `apps/web` doubles the path (`apps/web/apps/web/.next`) and fails the deploy. Clear that field if a past setup left it filled.

Mirror all vars from [`.env.example`](.env.example) under **Settings → Environment Variables** (Production + Preview).

## Production checklist

- [x] Apply Supabase migration (schema already on project)
- [x] Create Storage bucket `media`
- [x] Seed catalog (`npm run seed:demo`)
- [ ] Apply auth trigger fix SQL (for real Auth users)
- [ ] Set Resend API keys
- [ ] Set `NEXT_PUBLIC_SITE_URL` to production URL
- [ ] Mirror env vars on Vercel
- [ ] Clear Vercel Output Directory (must be empty)
- [ ] Rotate keys that were shared in chat
