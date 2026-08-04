/**
 * Seed Supabase from apps/web/data/demo.ts
 *
 * Usage (from repo root):
 *   npx tsx apps/web/scripts/seed-from-demo.ts
 *   npm run seed:demo
 */
import { createHash } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  destinations,
  hotels,
  experiences,
  collections,
  itineraries,
  blogPosts,
  testimonials,
  faqs,
  enquiries,
} from '../data/demo';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Deterministic UUID v4-shaped id from an arbitrary key. */
function idFrom(key: string): string {
  const h = createHash('sha256').update(key).digest();
  const bytes = Buffer.from(h.subarray(0, 16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function loadEnvLocal() {
  const candidates = [
    resolve(__dirname, '../.env.local'),
    resolve(process.cwd(), 'apps/web/.env.local'),
    resolve(process.cwd(), '.env.local'),
  ];

  for (const file of candidates) {
    if (!existsSync(file)) continue;
    const raw = readFileSync(file, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
    console.log(`Loaded env from ${file}`);
    return;
  }

  console.warn('No .env.local found — relying on process.env');
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function mediaIdFor(url: string, key: string): string {
  return idFrom(`media:${key}:${url}`);
}

async function upsertMedia(
  supabase: SupabaseClient,
  url: string,
  key: string,
  alt = '',
  title = '',
): Promise<string> {
  const id = mediaIdFor(url, key);
  const { error } = await supabase.from('media_assets').upsert(
    {
      id,
      storage_path: `seed/${key}`,
      url,
      mime_type: 'image/jpeg',
      alt,
      title,
    },
    { onConflict: 'id' },
  );
  if (error) throw new Error(`media_assets upsert (${key}): ${error.message}`);
  return id;
}

const NIL = '00000000-0000-0000-0000-000000000000';

async function clearTable(
  supabase: SupabaseClient,
  table: string,
  filterColumn: string,
) {
  const { error } = await supabase.from(table).delete().neq(filterColumn, NIL);
  if (error) {
    console.warn(`  warn clearing ${table}: ${error.message}`);
  }
}

async function deleteAllContent(supabase: SupabaseClient) {
  console.log('Clearing existing content (FK-safe order)…');

  // Child / junction first
  const byId = [
    'enquiry_notes',
    'enquiries',
    'faq_translations',
    'faqs',
    'testimonial_translations',
    'testimonials',
    'blog_post_translations',
    'blog_posts',
    'blog_authors',
    'blog_category_translations',
    'blog_categories',
    'itinerary_day_translations',
    'itinerary_days',
    'itinerary_translations',
    'collection_items',
    'collection_translations',
    'collections',
    'experience_gallery',
    'experience_translations',
    'experiences',
    'hotel_gallery',
    'hotel_translations',
    'hotels',
    'destination_gallery',
    'destination_translations',
    'itineraries',
  ] as const;

  for (const table of byId) {
    await clearTable(supabase, table, 'id');
  }

  const junctions: Array<[string, string]> = [
    ['itinerary_experiences', 'itinerary_id'],
    ['itinerary_hotels', 'itinerary_id'],
    ['itinerary_destinations', 'itinerary_id'],
    ['destination_itineraries', 'destination_id'],
    ['experience_hotels', 'experience_id'],
    ['destination_experiences', 'destination_id'],
    ['destination_hotels', 'destination_id'],
    ['destination_relations', 'destination_id'],
  ];

  for (const [table, col] of junctions) {
    await clearTable(supabase, table, col);
  }

  // Break destination self-FK, then delete
  await supabase.from('destinations').update({ parent_id: null }).neq('id', NIL);
  await clearTable(supabase, 'destinations', 'id');

  await clearTable(supabase, 'media_translations', 'id');
  const { error: mediaErr } = await supabase
    .from('media_assets')
    .delete()
    .like('storage_path', 'seed/%');
  if (mediaErr) console.warn(`  warn clearing media: ${mediaErr.message}`);

  console.log('  done clearing');
}

async function seedDestinations(supabase: SupabaseClient) {
  const order = { continent: 0, country: 1, city: 2 } as const;
  const sorted = [...destinations].sort(
    (a, b) => order[a.type] - order[b.type],
  );

  let count = 0;
  for (const d of sorted) {
    const id = idFrom(`destination:${d.id}`);
    const heroId = await upsertMedia(supabase, d.image, `dest-${d.id}`, d.name, d.name);
    const parentId = d.parentId ? idFrom(`destination:${d.parentId}`) : null;

    const { error } = await supabase.from('destinations').upsert(
      {
        id,
        type: d.type,
        parent_id: parentId,
        slug: d.slug,
        slug_path: d.slugPath,
        status: 'published',
        featured: d.featured,
        sort_order: count,
        hero_media_id: heroId,
        cover_media_id: heroId,
        published_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );
    if (error) throw new Error(`destinations ${d.id}: ${error.message}`);

    const { error: tErr } = await supabase.from('destination_translations').upsert(
      {
        id: idFrom(`destination_tr:en:${d.id}`),
        destination_id: id,
        locale: 'en',
        name: d.name,
        tagline: d.tagline,
        overview: d.overview,
        highlights: d.highlights,
        best_time_to_visit: d.bestTimeToVisit,
        weather: d.weather,
        visa_info: d.visaInfo,
        currency: d.currency,
        languages: d.languages,
        timezone: d.timezone,
        meta_title: d.name,
        meta_description: d.tagline || d.overview.slice(0, 160),
      },
      { onConflict: 'destination_id,locale' },
    );
    if (tErr) throw new Error(`destination_translations ${d.id}: ${tErr.message}`);
    count++;
  }
  console.log(`  destinations: ${count}`);
  return count;
}

async function seedHotels(supabase: SupabaseClient) {
  let count = 0;
  for (const h of hotels) {
    const id = idFrom(`hotel:${h.id}`);
    const heroId = await upsertMedia(supabase, h.image, `hotel-${h.id}`, h.name, h.name);

    const { error } = await supabase.from('hotels').upsert(
      {
        id,
        slug: h.slug,
        status: 'published',
        featured: true,
        star_rating: h.starRating,
        amenities: h.amenities,
        hero_media_id: heroId,
        destination_id: idFrom(`destination:${h.destinationId}`),
      },
      { onConflict: 'id' },
    );
    if (error) throw new Error(`hotels ${h.id}: ${error.message}`);

    const { error: tErr } = await supabase.from('hotel_translations').upsert(
      {
        id: idFrom(`hotel_tr:en:${h.id}`),
        hotel_id: id,
        locale: 'en',
        name: h.name,
        location_label: h.locationLabel,
        description: h.description,
        meta_title: h.name,
        meta_description: h.description.slice(0, 160),
      },
      { onConflict: 'hotel_id,locale' },
    );
    if (tErr) throw new Error(`hotel_translations ${h.id}: ${tErr.message}`);

    await supabase.from('destination_hotels').upsert(
      {
        destination_id: idFrom(`destination:${h.destinationId}`),
        hotel_id: id,
        sort_order: count,
      },
      { onConflict: 'destination_id,hotel_id' },
    );

    count++;
  }
  console.log(`  hotels: ${count}`);
  return count;
}

async function seedExperiences(supabase: SupabaseClient) {
  let count = 0;
  for (const e of experiences) {
    const id = idFrom(`experience:${e.id}`);
    const heroId = await upsertMedia(supabase, e.image, `exp-${e.id}`, e.name, e.name);

    const { error } = await supabase.from('experiences').upsert(
      {
        id,
        slug: e.slug,
        category: e.category,
        status: 'published',
        featured: true,
        hero_media_id: heroId,
        sort_order: count,
      },
      { onConflict: 'id' },
    );
    if (error) throw new Error(`experiences ${e.id}: ${error.message}`);

    const { error: tErr } = await supabase.from('experience_translations').upsert(
      {
        id: idFrom(`experience_tr:en:${e.id}`),
        experience_id: id,
        locale: 'en',
        name: e.name,
        tagline: e.tagline,
        description: e.description,
        meta_title: e.name,
        meta_description: e.tagline || e.description.slice(0, 160),
      },
      { onConflict: 'experience_id,locale' },
    );
    if (tErr) throw new Error(`experience_translations ${e.id}: ${tErr.message}`);
    count++;
  }
  console.log(`  experiences: ${count}`);
  return count;
}

async function seedCollections(supabase: SupabaseClient) {
  let count = 0;
  for (const c of collections) {
    const id = idFrom(`collection:${c.id}`);
    const heroId = await upsertMedia(supabase, c.image, `col-${c.id}`, c.name, c.name);

    const { error } = await supabase.from('collections').upsert(
      {
        id,
        slug: c.slug,
        status: 'published',
        featured: true,
        hero_media_id: heroId,
        sort_order: count,
      },
      { onConflict: 'id' },
    );
    if (error) throw new Error(`collections ${c.id}: ${error.message}`);

    const { error: tErr } = await supabase.from('collection_translations').upsert(
      {
        id: idFrom(`collection_tr:en:${c.id}`),
        collection_id: id,
        locale: 'en',
        name: c.name,
        tagline: c.tagline,
        description: c.description,
        meta_title: c.name,
        meta_description: c.tagline || c.description.slice(0, 160),
      },
      { onConflict: 'collection_id,locale' },
    );
    if (tErr) throw new Error(`collection_translations ${c.id}: ${tErr.message}`);
    count++;
  }
  console.log(`  collections: ${count}`);
  return count;
}

async function seedItineraries(supabase: SupabaseClient) {
  let count = 0;
  for (const it of itineraries) {
    const id = idFrom(`itinerary:${it.id}`);
    const heroId = await upsertMedia(
      supabase,
      it.image,
      `itin-${it.id}`,
      it.title,
      it.title,
    );

    const included = {
      items: it.included,
      places: it.places,
      glanceStops: it.glanceStops,
      extensions: it.extensions,
      countryName: it.countryName,
      placesLabel: it.placesLabel,
    };

    const { error } = await supabase.from('itineraries').upsert(
      {
        id,
        slug: it.slug,
        status: 'published',
        featured: true,
        duration_days: it.durationDays,
        price_from: it.priceFrom,
        currency: it.currency,
        included,
        excluded: it.excluded,
        hero_media_id: heroId,
        sort_order: count,
      },
      { onConflict: 'id' },
    );
    if (error) throw new Error(`itineraries ${it.id}: ${error.message}`);

    const { error: tErr } = await supabase.from('itinerary_translations').upsert(
      {
        id: idFrom(`itinerary_tr:en:${it.id}`),
        itinerary_id: id,
        locale: 'en',
        title: it.title,
        summary: it.summary,
        description: it.summary,
        cities_label: it.citiesLabel,
        meta_title: it.title,
        meta_description: it.summary.slice(0, 160),
      },
      { onConflict: 'itinerary_id,locale' },
    );
    if (tErr) throw new Error(`itinerary_translations ${it.id}: ${tErr.message}`);

    for (const day of it.days) {
      const dayId = idFrom(`itinerary_day:${it.id}:${day.day}`);
      const { error: dErr } = await supabase.from('itinerary_days').upsert(
        {
          id: dayId,
          itinerary_id: id,
          day_number: day.day,
          sort_order: day.day,
        },
        { onConflict: 'id' },
      );
      if (dErr) throw new Error(`itinerary_days ${it.id} d${day.day}: ${dErr.message}`);

      const { error: dtErr } = await supabase.from('itinerary_day_translations').upsert(
        {
          id: idFrom(`itinerary_day_tr:en:${it.id}:${day.day}`),
          day_id: dayId,
          locale: 'en',
          title: day.title,
          body: day.body,
        },
        { onConflict: 'day_id,locale' },
      );
      if (dtErr) {
        throw new Error(
          `itinerary_day_translations ${it.id} d${day.day}: ${dtErr.message}`,
        );
      }
    }

    let linkOrder = 0;
    for (const destDemoId of it.destinationIds) {
      const destinationId = idFrom(`destination:${destDemoId}`);
      const { error: linkErr } = await supabase.from('itinerary_destinations').upsert(
        {
          itinerary_id: id,
          destination_id: destinationId,
          sort_order: linkOrder,
        },
        { onConflict: 'itinerary_id,destination_id' },
      );
      if (linkErr) {
        throw new Error(
          `itinerary_destinations ${it.id}/${destDemoId}: ${linkErr.message}`,
        );
      }
      await supabase.from('destination_itineraries').upsert(
        {
          destination_id: destinationId,
          itinerary_id: id,
          sort_order: linkOrder,
        },
        { onConflict: 'destination_id,itinerary_id' },
      );
      linkOrder++;
    }

    count++;
  }
  console.log(`  itineraries: ${count}`);
  return count;
}

async function seedBlog(supabase: SupabaseClient) {
  const authorIds = new Map<string, string>();
  const categoryIds = new Map<string, string>();
  let count = 0;

  for (const post of blogPosts) {
    if (!authorIds.has(post.author)) {
      const authorId = idFrom(`blog_author:${post.author}`);
      const { error } = await supabase.from('blog_authors').upsert(
        {
          id: authorId,
          slug: slugify(post.author),
          name: post.author,
          bio: '',
        },
        { onConflict: 'id' },
      );
      if (error) throw new Error(`blog_authors ${post.author}: ${error.message}`);
      authorIds.set(post.author, authorId);
    }

    if (!categoryIds.has(post.category)) {
      const categoryId = idFrom(`blog_category:${post.category}`);
      const { error } = await supabase.from('blog_categories').upsert(
        {
          id: categoryId,
          slug: slugify(post.category),
          sort_order: categoryIds.size,
        },
        { onConflict: 'id' },
      );
      if (error) throw new Error(`blog_categories ${post.category}: ${error.message}`);

      const { error: ctErr } = await supabase
        .from('blog_category_translations')
        .upsert(
          {
            id: idFrom(`blog_category_tr:en:${post.category}`),
            category_id: categoryId,
            locale: 'en',
            name: post.category,
            description: '',
          },
          { onConflict: 'category_id,locale' },
        );
      if (ctErr) {
        throw new Error(`blog_category_translations ${post.category}: ${ctErr.message}`);
      }
      categoryIds.set(post.category, categoryId);
    }

    const id = idFrom(`blog_post:${post.id}`);
    const coverId = await upsertMedia(
      supabase,
      post.image,
      `blog-${post.id}`,
      post.title,
      post.title,
    );

    const paragraphs = post.body
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (paragraphs.length === 0) paragraphs.push(post.body);

    const { error } = await supabase.from('blog_posts').upsert(
      {
        id,
        slug: post.slug,
        status: 'published',
        featured: count === 0,
        author_id: authorIds.get(post.author),
        category_id: categoryIds.get(post.category),
        cover_media_id: coverId,
        published_at: new Date(post.publishedAt).toISOString(),
      },
      { onConflict: 'id' },
    );
    if (error) throw new Error(`blog_posts ${post.id}: ${error.message}`);

    const { error: tErr } = await supabase.from('blog_post_translations').upsert(
      {
        id: idFrom(`blog_post_tr:en:${post.id}`),
        post_id: id,
        locale: 'en',
        title: post.title,
        excerpt: post.excerpt,
        body: paragraphs,
        meta_title: post.title,
        meta_description: post.excerpt.slice(0, 160),
      },
      { onConflict: 'post_id,locale' },
    );
    if (tErr) throw new Error(`blog_post_translations ${post.id}: ${tErr.message}`);
    count++;
  }
  console.log(`  blog posts: ${count} (authors: ${authorIds.size}, categories: ${categoryIds.size})`);
  return count;
}

async function seedTestimonials(supabase: SupabaseClient) {
  let count = 0;
  for (const t of testimonials) {
    const id = idFrom(`testimonial:${t.id}`);
    const { error } = await supabase.from('testimonials').upsert(
      {
        id,
        status: 'published',
        featured: true,
        rating: t.rating,
        sort_order: count,
      },
      { onConflict: 'id' },
    );
    if (error) throw new Error(`testimonials ${t.id}: ${error.message}`);

    const { error: tErr } = await supabase.from('testimonial_translations').upsert(
      {
        id: idFrom(`testimonial_tr:en:${t.id}`),
        testimonial_id: id,
        locale: 'en',
        author_name: t.authorName,
        author_location: t.authorLocation,
        quote: t.quote,
        trip_label: t.tripLabel,
      },
      { onConflict: 'testimonial_id,locale' },
    );
    if (tErr) throw new Error(`testimonial_translations ${t.id}: ${tErr.message}`);
    count++;
  }
  console.log(`  testimonials: ${count}`);
  return count;
}

async function seedFaqs(supabase: SupabaseClient) {
  let count = 0;
  for (const f of faqs) {
    const id = idFrom(`faq:${f.id}`);
    const { error } = await supabase.from('faqs').upsert(
      {
        id,
        entity_type: 'global',
        entity_id: null,
        status: 'published',
        sort_order: count,
      },
      { onConflict: 'id' },
    );
    if (error) throw new Error(`faqs ${f.id}: ${error.message}`);

    const { error: tErr } = await supabase.from('faq_translations').upsert(
      {
        id: idFrom(`faq_tr:en:${f.id}`),
        faq_id: id,
        locale: 'en',
        question: f.question,
        answer: f.answer,
      },
      { onConflict: 'faq_id,locale' },
    );
    if (tErr) throw new Error(`faq_translations ${f.id}: ${tErr.message}`);
    count++;
  }
  console.log(`  faqs: ${count}`);
  return count;
}

async function seedEnquiries(supabase: SupabaseClient) {
  let count = 0;
  for (const e of enquiries) {
    const id = idFrom(`enquiry:${e.id}`);
    const notes = [e.destination ? `Destination: ${e.destination}` : null, e.notes]
      .filter(Boolean)
      .join('\n\n');

    const { error } = await supabase.from('enquiries').upsert(
      {
        id,
        full_name: e.fullName,
        email: e.email,
        phone: e.phone,
        travel_date: e.travelDate || null,
        budget: e.budget,
        adults: e.adults,
        children: e.children,
        travel_style: e.travelStyle,
        notes,
        status: e.status,
        locale: 'en',
        created_at: e.createdAt,
      },
      { onConflict: 'id' },
    );
    if (error) throw new Error(`enquiries ${e.id}: ${error.message}`);
    count++;
  }
  console.log(`  enquiries: ${count}`);
  return count;
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in apps/web/.env.local',
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log('Seeding from demo data…');
  await deleteAllContent(supabase);

  console.log('Inserting…');
  await seedDestinations(supabase);
  await seedHotels(supabase);
  await seedExperiences(supabase);
  await seedCollections(supabase);
  await seedItineraries(supabase);
  await seedBlog(supabase);
  await seedTestimonials(supabase);
  await seedFaqs(supabase);
  await seedEnquiries(supabase);

  console.log('Seed complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
