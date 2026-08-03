# Uncharted Journeys — Luxury Travel Website + CMS

Enterprise-grade luxury travel platform with a custom Admin CMS on Supabase.

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Supabase · Zod · React Hook Form · Resend · Vercel

## Getting started

```bash
cp .env.example apps/web/.env.local
cd apps/web
npm install
npm run dev
```

| Surface | URL |
|---|---|
| Public site | http://localhost:3000/en |
| Admin CMS | http://localhost:3000/admin |
| Login | http://localhost:3000/admin/login |

Demo mode ships with rich seed content (no Supabase required). Connect Supabase and set `USE_DEMO_DATA=false` for production.

## Features

- Cinematic marketing site matching luxury travel references
- Destination hierarchy: Continent → Country → City
- Experiences, hotels, itineraries, collections, blog
- Enquiry forms + CSV export + Resend email hooks
- Full admin dashboard with RBAC matrix
- Media library, SEO defaults/redirects, homepage builder
- Multi-language ready (EN + EL/DE/FR/IT/ES/AR)
- Sitemap, robots.txt, Open Graph, JSON-LD

## Project structure

```
apps/web/          Next.js app (public + /admin)
packages/          shared, config, database
supabase/          SQL migrations + RLS
docs/              architecture notes
```

## Production checklist

- [ ] Apply Supabase migration
- [ ] Configure Auth users + roles in `profiles`
- [ ] Create Storage bucket `media`
- [ ] Set Resend API keys
- [ ] Set `NEXT_PUBLIC_SITE_URL`
- [ ] Disable `USE_DEMO_DATA`
- [ ] Deploy to Vercel
