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
import { getSiteUrl } from '@/lib/site-url';

const base = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    '',
    '/destinations',
    '/explore',
    '/experiences',
    '/collections',
    '/itineraries',
    '/hotels',
    '/blog',
    '/about',
    '/contact',
    '/plan-your-journey',
  ];

  const [
    destinations,
    experiences,
    hotels,
    itineraries,
    collections,
    posts,
  ] = await Promise.all([
    destinationQueries.getAll(),
    experienceQueries.getAll(),
    hotelQueries.getAll(),
    itineraryQueries.getAll(),
    collectionQueries.getAll(),
    blogQueries.getAll(),
  ]);

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

    for (const d of destinations) {
      entries.push({
        url: `${base}/${locale}/destinations/${d.slugPath}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
    for (const e of experiences) {
      entries.push({
        url: `${base}/${locale}/experiences/${e.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
    for (const h of hotels) {
      entries.push({
        url: `${base}/${locale}/hotels/${h.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
    for (const i of itineraries) {
      entries.push({
        url: `${base}/${locale}/itineraries/${i.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
    for (const c of collections) {
      entries.push({
        url: `${base}/${locale}/collections/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
    for (const p of posts) {
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
