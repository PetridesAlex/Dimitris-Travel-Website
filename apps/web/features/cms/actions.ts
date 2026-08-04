'use server';

import { createHash, randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireCmsSession } from '@/lib/cms/auth';
import { createServiceClient } from '@/lib/supabase/server';
import type { ActionResult } from '@/features/cms/types';

type Sb = SupabaseClient<any, 'public', any>;

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? '').trim();
}

function opt(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v || null;
}

function bool(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === 'on' || v === 'true' || v === '1';
}

function num(fd: FormData, key: string, fallback = 0): number {
  const n = Number(str(fd, key));
  return Number.isFinite(n) ? n : fallback;
}

function list(fd: FormData, key: string): string[] {
  return str(fd, key)
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseJsonField<T>(raw: string, fallback: T): T {
  if (!raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Deterministic UUID v4-shaped id from an arbitrary key. */
function idFrom(key: string): string {
  const h = createHash('sha256').update(key).digest();
  const bytes = Buffer.from(h.subarray(0, 16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

async function upsertMediaFromUrl(
  db: Sb,
  url: string,
  key: string,
  alt = '',
): Promise<string> {
  const id = idFrom(`media:${key}:${url}`);
  const { error } = await (db as any).from('media_assets').upsert(
    {
      id,
      storage_path: `cms/${key}`,
      url,
      mime_type: 'image/jpeg',
      alt,
      title: alt || key,
    },
    { onConflict: 'id' },
  );
  if (error) throw new Error(error.message);
  return id;
}

async function requireDb(): Promise<
  { ok: true; db: Sb } | { ok: false; error: string }
> {
  await requireCmsSession();
  const db = createServiceClient();
  if (!db) return { ok: false, error: 'No database' };
  return { ok: true, db: db as unknown as Sb };
}

function revalidatePublic(...paths: string[]) {
  for (const p of paths) revalidatePath(p);
}

function revalidateAdmin(...resources: string[]) {
  for (const r of resources) {
    revalidatePath(`/admin/${r}`);
    revalidatePath(`/admin`);
  }
}

// ─── Destinations ────────────────────────────────────────────────────────────

export async function saveDestination(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const { db } = gate;

  try {
    const id = str(formData, 'id') || randomUUID();
    const isNew = !str(formData, 'id');
    const type = str(formData, 'type') || 'country';
    const parentId = opt(formData, 'parentId');
    const slug = str(formData, 'slug') || slugify(str(formData, 'name'));
    const slugPath = str(formData, 'slugPath') || slug;
    const name = str(formData, 'name');
    const image = str(formData, 'image');
    const status = str(formData, 'status') || 'draft';
    const featured = bool(formData, 'featured');

    if (!name) return { ok: false, error: 'Name is required' };

    const row: Record<string, unknown> = {
      id,
      type,
      parent_id: parentId,
      slug,
      slug_path: slugPath,
      status,
      featured,
      updated_at: new Date().toISOString(),
      ...(isNew ? { created_at: new Date().toISOString() } : {}),
      ...(status === 'published' ? { published_at: new Date().toISOString() } : {}),
    };
    if (image) {
      row.hero_media_id = await upsertMediaFromUrl(db, image, `dest-${id}`, name);
    }

    const { error } = await (db as any).from('destinations').upsert(row, { onConflict: 'id' });
    if (error) return { ok: false, error: error.message };

    const { error: trErr } = await (db as any).from('destination_translations').upsert(
      {
        destination_id: id,
        locale: 'en',
        name,
        tagline: str(formData, 'tagline'),
        overview: str(formData, 'overview'),
        highlights: list(formData, 'highlights'),
        best_time_to_visit: str(formData, 'bestTimeToVisit'),
        currency: str(formData, 'currency'),
        languages: str(formData, 'languages'),
        timezone: str(formData, 'timezone'),
        visa_info: str(formData, 'visaInfo'),
        weather: str(formData, 'weather'),
      },
      { onConflict: 'destination_id,locale' },
    );
    if (trErr) return { ok: false, error: trErr.message };

    revalidateAdmin('destinations');
    revalidatePublic('/en/destinations', `/en/destinations/${slugPath}`);
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function deleteDestination(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const id = str(formData, 'id');
  if (!id) return { ok: false, error: 'Missing id' };
  const { error } = await (gate.db as any).from('destinations').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateAdmin('destinations');
  revalidatePublic('/en/destinations');
  return { ok: true, id };
}

// ─── Hotels ──────────────────────────────────────────────────────────────────

export async function saveHotel(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const { db } = gate;

  try {
    const id = str(formData, 'id') || randomUUID();
    const name = str(formData, 'name');
    const slug = str(formData, 'slug') || slugify(name);
    const image = str(formData, 'image');
    if (!name) return { ok: false, error: 'Name is required' };

    const hotelRow: Record<string, unknown> = {
      id,
      slug,
      status: str(formData, 'status') || 'draft',
      star_rating: num(formData, 'starRating', 5),
      destination_id: opt(formData, 'destinationId'),
      amenities: list(formData, 'amenities'),
      updated_at: new Date().toISOString(),
    };
    if (image) {
      hotelRow.hero_media_id = await upsertMediaFromUrl(db, image, `hotel-${id}`, name);
    }

    const { error } = await (db as any).from('hotels').upsert(hotelRow, { onConflict: 'id' });
    if (error) return { ok: false, error: error.message };

    const { error: trErr } = await (db as any).from('hotel_translations').upsert(
      {
        hotel_id: id,
        locale: 'en',
        name,
        location_label: str(formData, 'locationLabel'),
        description: str(formData, 'description'),
      },
      { onConflict: 'hotel_id,locale' },
    );
    if (trErr) return { ok: false, error: trErr.message };

    revalidateAdmin('hotels');
    revalidatePublic('/en/hotels', `/en/hotels/${slug}`);
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function deleteHotel(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const id = str(formData, 'id');
  if (!id) return { ok: false, error: 'Missing id' };
  const { error } = await (gate.db as any).from('hotels').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateAdmin('hotels');
  revalidatePublic('/en/hotels');
  return { ok: true, id };
}

// ─── Experiences ─────────────────────────────────────────────────────────────

export async function saveExperience(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const { db } = gate;

  try {
    const id = str(formData, 'id') || randomUUID();
    const name = str(formData, 'name');
    const slug = str(formData, 'slug') || slugify(name);
    const image = str(formData, 'image');
    if (!name) return { ok: false, error: 'Name is required' };

    const expRow: Record<string, unknown> = {
      id,
      slug,
      category: str(formData, 'category') || 'culture',
      status: str(formData, 'status') || 'draft',
      updated_at: new Date().toISOString(),
    };
    if (image) {
      expRow.hero_media_id = await upsertMediaFromUrl(db, image, `exp-${id}`, name);
    }

    const { error } = await (db as any).from('experiences').upsert(expRow, { onConflict: 'id' });
    if (error) return { ok: false, error: error.message };

    const { error: trErr } = await (db as any).from('experience_translations').upsert(
      {
        experience_id: id,
        locale: 'en',
        name,
        tagline: str(formData, 'tagline'),
        description: str(formData, 'description'),
      },
      { onConflict: 'experience_id,locale' },
    );
    if (trErr) return { ok: false, error: trErr.message };

    revalidateAdmin('experiences');
    revalidatePublic('/en/experiences', `/en/experiences/${slug}`);
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function deleteExperience(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const id = str(formData, 'id');
  if (!id) return { ok: false, error: 'Missing id' };
  const { error } = await (gate.db as any).from('experiences').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateAdmin('experiences');
  revalidatePublic('/en/experiences');
  return { ok: true, id };
}

// ─── Collections ─────────────────────────────────────────────────────────────

export async function saveCollection(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const { db } = gate;

  try {
    const id = str(formData, 'id') || randomUUID();
    const name = str(formData, 'name');
    const slug = str(formData, 'slug') || slugify(name);
    const image = str(formData, 'image');
    if (!name) return { ok: false, error: 'Name is required' };

    const colRow: Record<string, unknown> = {
      id,
      slug,
      status: str(formData, 'status') || 'draft',
      updated_at: new Date().toISOString(),
    };
    if (image) {
      colRow.hero_media_id = await upsertMediaFromUrl(db, image, `col-${id}`, name);
    }

    const { error } = await (db as any).from('collections').upsert(colRow, { onConflict: 'id' });
    if (error) return { ok: false, error: error.message };

    const { error: trErr } = await (db as any).from('collection_translations').upsert(
      {
        collection_id: id,
        locale: 'en',
        name,
        tagline: str(formData, 'tagline'),
        description: str(formData, 'description'),
      },
      { onConflict: 'collection_id,locale' },
    );
    if (trErr) return { ok: false, error: trErr.message };

    revalidateAdmin('collections');
    revalidatePublic('/en/collections', `/en/collections/${slug}`);
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function deleteCollection(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const id = str(formData, 'id');
  if (!id) return { ok: false, error: 'Missing id' };
  const { error } = await (gate.db as any).from('collections').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateAdmin('collections');
  revalidatePublic('/en/collections');
  return { ok: true, id };
}

// ─── Itineraries ─────────────────────────────────────────────────────────────

export async function saveItinerary(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const { db } = gate;

  try {
    const id = str(formData, 'id') || randomUUID();
    const title = str(formData, 'title');
    const slug = str(formData, 'slug') || slugify(title);
    const image = str(formData, 'image');
    if (!title) return { ok: false, error: 'Title is required' };

    const items = list(formData, 'included');
    const placesRaw = str(formData, 'places');
    const glanceRaw = str(formData, 'glanceStops');
    const extensionsRaw = str(formData, 'extensions');
    const daysRaw = str(formData, 'days');
    const countryName = str(formData, 'countryName');
    const placesLabel = str(formData, 'placesLabel') || 'Places';
    const flights = list(formData, 'flights');
    const departureDates = list(formData, 'departureDates');
    const terms = list(formData, 'terms');
    const days = daysRaw ? parseJsonField(daysRaw, []) : [];

    const hasComplex =
      placesRaw ||
      glanceRaw ||
      extensionsRaw ||
      daysRaw ||
      flights.length > 0 ||
      departureDates.length > 0 ||
      terms.length > 0 ||
      countryName ||
      placesLabel !== 'Places';

    const included = hasComplex
      ? {
          items,
          places: parseJsonField(placesRaw, []),
          glanceStops: parseJsonField(glanceRaw, []),
          extensions: parseJsonField(extensionsRaw, []),
          days,
          flights,
          departureDates,
          terms,
          countryName,
          placesLabel,
        }
      : items;

    const itinRow: Record<string, unknown> = {
      id,
      slug,
      status: str(formData, 'status') || 'draft',
      duration_days: num(formData, 'durationDays', 7),
      price_from: num(formData, 'priceFrom', 0),
      currency: str(formData, 'currency') || 'EUR',
      included,
      excluded: list(formData, 'excluded'),
      updated_at: new Date().toISOString(),
    };
    if (image) {
      itinRow.hero_media_id = await upsertMediaFromUrl(db, image, `itin-${id}`, title);
    }

    const { error } = await (db as any).from('itineraries').upsert(itinRow, { onConflict: 'id' });
    if (error) return { ok: false, error: error.message };

    const { error: trErr } = await (db as any).from('itinerary_translations').upsert(
      {
        itinerary_id: id,
        locale: 'en',
        title,
        summary: str(formData, 'summary'),
        cities_label: str(formData, 'citiesLabel'),
      },
      { onConflict: 'itinerary_id,locale' },
    );
    if (trErr) return { ok: false, error: trErr.message };

    revalidateAdmin('itineraries');
    revalidatePublic('/en/itineraries', `/en/itineraries/${slug}`);
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function deleteItinerary(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const id = str(formData, 'id');
  if (!id) return { ok: false, error: 'Missing id' };
  const { error } = await (gate.db as any).from('itineraries').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateAdmin('itineraries');
  revalidatePublic('/en/itineraries');
  return { ok: true, id };
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export async function saveBlogPost(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const { db } = gate;

  try {
    const id = str(formData, 'id') || randomUUID();
    const title = str(formData, 'title');
    const slug = str(formData, 'slug') || slugify(title);
    const image = str(formData, 'image');
    const status = str(formData, 'status') || 'draft';
    if (!title) return { ok: false, error: 'Title is required' };

    const bodyText = str(formData, 'body');
    const body = bodyText
      ? bodyText.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
      : [];

    const blogRow: Record<string, unknown> = {
      id,
      slug,
      status,
      published_at:
        status === 'published'
          ? str(formData, 'publishedAt') || new Date().toISOString()
          : opt(formData, 'publishedAt'),
      updated_at: new Date().toISOString(),
    };
    if (image) {
      blogRow.cover_media_id = await upsertMediaFromUrl(db, image, `blog-${id}`, title);
    }

    const { error } = await (db as any).from('blog_posts').upsert(blogRow, { onConflict: 'id' });
    if (error) return { ok: false, error: error.message };

    const { error: trErr } = await (db as any).from('blog_post_translations').upsert(
      {
        post_id: id,
        locale: 'en',
        title,
        excerpt: str(formData, 'excerpt'),
        body,
      },
      { onConflict: 'post_id,locale' },
    );
    if (trErr) return { ok: false, error: trErr.message };

    revalidateAdmin('blog');
    revalidatePublic('/en/blog', `/en/blog/${slug}`);
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function deleteBlogPost(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const id = str(formData, 'id');
  if (!id) return { ok: false, error: 'Missing id' };
  const { error } = await (gate.db as any).from('blog_posts').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateAdmin('blog');
  revalidatePublic('/en/blog');
  return { ok: true, id };
}

// ─── Testimonials ────────────────────────────────────────────────────────────

export async function saveTestimonial(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const { db } = gate;

  try {
    const id = str(formData, 'id') || randomUUID();
    const authorName = str(formData, 'authorName');
    const quote = str(formData, 'quote');
    if (!authorName || !quote) return { ok: false, error: 'Author and quote are required' };

    const { error } = await (db as any).from('testimonials').upsert(
      {
        id,
        status: str(formData, 'status') || 'published',
        rating: num(formData, 'rating', 5),
      },
      { onConflict: 'id' },
    );
    if (error) return { ok: false, error: error.message };

    const { error: trErr } = await (db as any).from('testimonial_translations').upsert(
      {
        testimonial_id: id,
        locale: 'en',
        author_name: authorName,
        author_location: str(formData, 'authorLocation'),
        quote,
        trip_label: str(formData, 'tripLabel'),
      },
      { onConflict: 'testimonial_id,locale' },
    );
    if (trErr) return { ok: false, error: trErr.message };

    revalidateAdmin('testimonials');
    revalidatePublic('/en');
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function deleteTestimonial(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const id = str(formData, 'id');
  if (!id) return { ok: false, error: 'Missing id' };
  const { error } = await (gate.db as any).from('testimonials').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateAdmin('testimonials');
  revalidatePublic('/en');
  return { ok: true, id };
}

// ─── FAQs ────────────────────────────────────────────────────────────────────

export async function saveFaq(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const { db } = gate;

  try {
    const id = str(formData, 'id') || randomUUID();
    const question = str(formData, 'question');
    const answer = str(formData, 'answer');
    if (!question || !answer) return { ok: false, error: 'Question and answer are required' };

    const { error } = await (db as any).from('faqs').upsert(
      {
        id,
        status: str(formData, 'status') || 'published',
        entity_type: str(formData, 'entityType') || 'global',
        entity_id: opt(formData, 'entityId'),
        sort_order: num(formData, 'sortOrder', 0),
      },
      { onConflict: 'id' },
    );
    if (error) return { ok: false, error: error.message };

    const { error: trErr } = await (db as any).from('faq_translations').upsert(
      {
        faq_id: id,
        locale: 'en',
        question,
        answer,
      },
      { onConflict: 'faq_id,locale' },
    );
    if (trErr) return { ok: false, error: trErr.message };

    revalidateAdmin('faqs');
    revalidatePublic('/en');
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function deleteFaq(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const id = str(formData, 'id');
  if (!id) return { ok: false, error: 'Missing id' };
  const { error } = await (gate.db as any).from('faqs').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateAdmin('faqs');
  revalidatePublic('/en');
  return { ok: true, id };
}

// ─── Enquiries ───────────────────────────────────────────────────────────────

export async function updateEnquiryStatus(
  id: string,
  status: string,
): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const { error } = await (gate.db as any)
    .from('enquiries')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateAdmin('enquiries');
  return { ok: true, id };
}

export async function updateEnquiryStatusAction(
  formData: FormData,
): Promise<ActionResult> {
  return updateEnquiryStatus(str(formData, 'id'), str(formData, 'status'));
}

export async function addEnquiryNote(id: string, body: string): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  if (!body.trim()) return { ok: false, error: 'Note body is required' };
  const noteId = randomUUID();
  const { error } = await (gate.db as any).from('enquiry_notes').insert({
    id: noteId,
    enquiry_id: id,
    body: body.trim(),
  });
  if (error) return { ok: false, error: error.message };
  revalidateAdmin('enquiries');
  revalidatePath(`/admin/enquiries/${id}`);
  return { ok: true, id: noteId };
}

export async function addEnquiryNoteAction(formData: FormData): Promise<ActionResult> {
  return addEnquiryNote(str(formData, 'id'), str(formData, 'body'));
}

// ─── Site settings / SEO / redirects ─────────────────────────────────────────

export async function saveSiteSettings(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const value = {
    name: str(formData, 'brandName'),
    phone: str(formData, 'phone'),
    email: str(formData, 'email'),
    address: str(formData, 'address'),
    socials: {
      instagram: str(formData, 'instagram'),
      facebook: str(formData, 'facebook'),
      linkedin: str(formData, 'linkedin'),
      telegram: str(formData, 'telegram'),
      whatsapp: str(formData, 'whatsapp'),
    },
  };
  const { error } = await (gate.db as any).from('site_settings').upsert(
    { key: 'brand', value, updated_at: new Date().toISOString() },
    { onConflict: 'key' },
  );
  if (error) return { ok: false, error: error.message };
  revalidateAdmin('settings');
  revalidatePublic('/en');
  return { ok: true };
}

export async function saveSeoDefaults(
  titleTemplate: string,
  description: string,
): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const { error } = await (gate.db as any).from('seo_defaults').upsert(
    {
      locale: 'en',
      title_template: titleTemplate,
      default_meta_description: description,
    },
    { onConflict: 'locale' },
  );
  if (error) return { ok: false, error: error.message };
  revalidateAdmin('seo');
  return { ok: true };
}

export async function saveSeoDefaultsAction(formData: FormData): Promise<ActionResult> {
  return saveSeoDefaults(str(formData, 'titleTemplate'), str(formData, 'description'));
}

export async function saveRedirect(
  from: string,
  to: string,
  code: number,
): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  if (!from || !to) return { ok: false, error: 'From and to are required' };
  const id = randomUUID();
  const { error } = await (gate.db as any).from('redirects').upsert(
    {
      id,
      from_path: from,
      to_path: to,
      status_code: code || 301,
      is_active: true,
    },
    { onConflict: 'from_path' },
  );
  if (error) return { ok: false, error: error.message };
  revalidateAdmin('seo');
  return { ok: true, id };
}

export async function saveRedirectAction(formData: FormData): Promise<ActionResult> {
  return saveRedirect(
    str(formData, 'from'),
    str(formData, 'to'),
    num(formData, 'code', 301),
  );
}

export async function deleteRedirect(id: string): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const { error } = await (gate.db as any).from('redirects').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateAdmin('seo');
  return { ok: true, id };
}

export async function deleteRedirectAction(formData: FormData): Promise<ActionResult> {
  return deleteRedirect(str(formData, 'id'));
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export async function saveNavigationItems(
  items: { id?: string; href: string; label: string; sortOrder: number }[],
): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const { db } = gate;

  try {
    let menuId: string;
    const { data: existing } = await (db as any)
      .from('navigation_menus')
      .select('id')
      .eq('key', 'primary')
      .maybeSingle();

    if (existing?.id) {
      menuId = existing.id;
    } else {
      menuId = randomUUID();
      const { error } = await (db as any).from('navigation_menus').insert({
        id: menuId,
        key: 'primary',
        label: 'Primary',
      });
      if (error) return { ok: false, error: error.message };
    }

    const { data: oldItems } = await (db as any)
      .from('navigation_items')
      .select('id')
      .eq('menu_id', menuId);
    const keep = new Set(items.map((i) => i.id).filter(Boolean));
    for (const old of oldItems || []) {
      if (!keep.has(old.id)) {
        await (db as any).from('navigation_items').delete().eq('id', old.id);
      }
    }

    for (const item of items) {
      const itemId = item.id || randomUUID();
      const { error } = await (db as any).from('navigation_items').upsert({
        id: itemId,
        menu_id: menuId,
        href: item.href,
        sort_order: item.sortOrder,
      });
      if (error) return { ok: false, error: error.message };

      const { error: trErr } = await (db as any)
        .from('navigation_item_translations')
        .upsert(
          { item_id: itemId, locale: 'en', label: item.label },
          { onConflict: 'item_id,locale' },
        );
      if (trErr) return { ok: false, error: trErr.message };
    }

    revalidateAdmin('navigation');
    revalidatePublic('/en');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Save failed' };
  }
}

export async function saveNavigationItemsAction(
  formData: FormData,
): Promise<ActionResult> {
  const raw = str(formData, 'items');
  const items = parseJsonField<
    { id?: string; href: string; label: string; sortOrder: number }[]
  >(raw, []);
  return saveNavigationItems(items);
}

// ─── Homepage ────────────────────────────────────────────────────────────────

export async function saveHomepageSections(
  sections: { id: string; type: string; enabled: boolean }[],
): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const { db } = gate;

  const { data: page } = await (db as any)
    .from('pages')
    .select('id')
    .eq('slug', 'home')
    .maybeSingle();

  let pageId = page?.id as string | undefined;
  if (!pageId) {
    pageId = randomUUID();
    const { error } = await (db as any).from('pages').insert({
      id: pageId,
      slug: 'home',
      status: 'published',
      template: 'home',
      sections,
    });
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await (db as any)
      .from('pages')
      .update({ sections, updated_at: new Date().toISOString() })
      .eq('id', pageId);
    if (error) return { ok: false, error: error.message };
  }

  revalidateAdmin('homepage');
  revalidatePublic('/en');
  return { ok: true, id: pageId };
}

export async function saveHomepageSectionsAction(
  formData: FormData,
): Promise<ActionResult> {
  const raw = str(formData, 'sections');
  const sections = parseJsonField<{ id: string; type: string; enabled: boolean }[]>(
    raw,
    [],
  );
  return saveHomepageSections(sections);
}

// ─── Media ───────────────────────────────────────────────────────────────────

export async function uploadMediaAsset(formData: FormData): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const { db } = gate;

  try {
    const alt = str(formData, 'alt');
    const title = str(formData, 'title') || alt || 'Media';
    const urlField = str(formData, 'url');
    const file = formData.get('file');

    if (file instanceof File && file.size > 0) {
      const ext = file.name.split('.').pop() || 'jpg';
      const id = randomUUID();
      const storagePath = `uploads/${id}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      const { error: upErr } = await db.storage
        .from('media')
        .upload(storagePath, buffer, {
          contentType: file.type || 'image/jpeg',
          upsert: true,
        });
      if (upErr) {
        return {
          ok: false,
          error: `Storage upload failed: ${upErr.message}. Ensure the "media" bucket exists and is public.`,
        };
      }
      const { data: pub } = db.storage.from('media').getPublicUrl(storagePath);
      const { error } = await (db as any).from('media_assets').insert({
        id,
        storage_path: storagePath,
        url: pub.publicUrl,
        mime_type: file.type || 'image/jpeg',
        size_bytes: file.size,
        alt,
        title,
      });
      if (error) return { ok: false, error: error.message };
      revalidateAdmin('media');
      return { ok: true, id };
    }

    if (urlField) {
      const id = await upsertMediaFromUrl(db, urlField, `upload-${randomUUID()}`, alt);
      if (title && title !== alt) {
        await (db as any).from('media_assets').update({ title }).eq('id', id);
      }
      revalidateAdmin('media');
      return { ok: true, id };
    }

    return { ok: false, error: 'Provide a file or URL' };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Upload failed' };
  }
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function listProfiles() {
  await requireCmsSession();
  const db = createServiceClient();
  if (!db) return [];
  const { data } = await (db as any)
    .from('profiles')
    .select('id, full_name, email, role, is_active, created_at')
    .order('created_at', { ascending: false });
  return (data || []) as Array<{
    id: string;
    full_name: string;
    email: string | null;
    role: string;
    is_active: boolean;
    created_at: string;
  }>;
}

export async function inviteUser(email: string, role: string): Promise<ActionResult> {
  const gate = await requireDb();
  if (!gate.ok) return gate;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return { ok: false, error: 'Email is required' };

  try {
    const { data, error } = await gate.db.auth.admin.inviteUserByEmail(trimmed, {
      data: { role: role || 'content_writer', full_name: '' },
    });
    if (error) {
      return {
        ok: false,
        error: `${error.message}. If this is a database error on signup, fix the Auth trigger (handle_new_user) — ensure it casts role to user_role and runs as SECURITY DEFINER.`,
      };
    }
    revalidateAdmin('users');
    return { ok: true, id: data.user?.id };
  } catch (e) {
    return {
      ok: false,
      error: `${e instanceof Error ? e.message : 'Invite failed'}. Check Auth trigger SQL (handle_new_user) if profile insert fails.`,
    };
  }
}

export async function inviteUserAction(formData: FormData): Promise<ActionResult> {
  return inviteUser(str(formData, 'email'), str(formData, 'role') || 'content_writer');
}
