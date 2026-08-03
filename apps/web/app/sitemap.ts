import type { MetadataRoute } from 'next';
import {
  destinationQueries,
  experienceQueries,
  hotelQueries,
  itineraryQueries,
  collectionQueries,
  blogQueries,
} from '@/features/catalog/queries';
import { LOCALES } from '@/lib/i18n/config';

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    '',
    '/destinations',
    '/experiences',
    '/collections',
    '/itineraries',
    '/hotels',
    '/blog',
    '/about',
    '/contact',
    '/plan-your-journey',
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of staticPaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.7,
      });
    }

    for (const d of destinationQueries.getAll()) {
      entries.push({
        url: `${base}/${locale}/destinations/${d.slugPath}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
    for (const e of experienceQueries.getAll()) {
      entries.push({
        url: `${base}/${locale}/experiences/${e.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
    for (const h of hotelQueries.getAll()) {
      entries.push({
        url: `${base}/${locale}/hotels/${h.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
    for (const i of itineraryQueries.getAll()) {
      entries.push({
        url: `${base}/${locale}/itineraries/${i.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
    for (const c of collectionQueries.getAll()) {
      entries.push({
        url: `${base}/${locale}/collections/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
    for (const p of blogQueries.getAll()) {
      entries.push({
        url: `${base}/${locale}/blog/${p.slug}`,
        lastModified: new Date(p.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
