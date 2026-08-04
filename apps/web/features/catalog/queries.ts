import {
  createAnonClient,
  createClient,
  createServiceClient,
  isDemoMode,
} from '@/lib/supabase/server';
import {
  destinations as demoDestinations,
  hotels as demoHotels,
  experiences as demoExperiences,
  itineraries as demoItineraries,
  collections as demoCollections,
  blogPosts as demoBlogPosts,
  testimonials as demoTestimonials,
  faqs as demoFaqs,
  enquiries as demoEnquiries,
  mediaAssets as demoMediaAssets,
  mediaFolders as demoMediaFolders,
  type DemoDestination,
  type DemoHotel,
  type DemoExperience,
  type DemoItinerary,
  type DemoCollection,
  type DemoBlogPost,
  type DemoTestimonial,
  type DemoEnquiry,
} from '@/data/demo';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Sb = any;

async function publicDb(): Promise<Sb | null> {
  if (isDemoMode()) return null;
  // Prefer cookie-free anon client so generateStaticParams / sitemap work at build time.
  return (createAnonClient() ?? createServiceClient()) as Sb | null;
}

/** Elevated client for CMS (cookie sessions have no Supabase JWT). */
export async function adminDb(): Promise<Sb | null> {
  if (isDemoMode()) return null;
  return (createServiceClient() ?? createAnonClient() ?? (await createClient())) as Sb | null;
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function onlyPublished<T>(rows: T[]): T[] {
  return rows.filter((r) => {
    const status = (r as { status?: string }).status;
    return !status || status === 'published';
  });
}

function includedExtras(included: unknown) {
  if (included && typeof included === 'object' && !Array.isArray(included)) {
    const obj = included as Record<string, unknown>;
    return {
      items: asArray<string>(obj.items ?? obj.list),
      places: asArray<DemoItinerary['places'][number]>(obj.places),
      glanceStops: asArray<DemoItinerary['glanceStops'][number]>(obj.glanceStops),
      extensions: asArray<DemoItinerary['extensions'][number]>(obj.extensions),
      flights: asArray<string>(obj.flights),
      departureDates: asArray<string>(obj.departureDates),
      terms: asArray<string>(obj.terms),
      days: asArray<DemoItinerary['days'][number]>(obj.days),
      countryName: String(obj.countryName ?? ''),
      placesLabel: String(obj.placesLabel ?? 'Places'),
    };
  }
  return {
    items: asArray<string>(included),
    places: [] as DemoItinerary['places'],
    glanceStops: [] as DemoItinerary['glanceStops'],
    extensions: [] as DemoItinerary['extensions'],
    flights: [] as string[],
    departureDates: [] as string[],
    terms: [] as string[],
    days: [] as DemoItinerary['days'],
    countryName: '',
    placesLabel: 'Places',
  };
}

async function mapDestinations(db: Sb): Promise<(DemoDestination & { status?: string })[]> {
  const { data, error } = await db
    .from('destinations')
    .select(
      'id, type, parent_id, slug, slug_path, featured, status, media_assets!hero_media_id(url), destination_translations(*)',
    )
    .order('sort_order', { ascending: true });

  if (error || !data?.length) return [];

  return data.map((row: any) => {
    const translations = row.destination_translations as Array<Record<string, unknown>> | null;
    const tr = translations?.find((t) => t.locale === 'en') || translations?.[0] || {};
    const hero = row.media_assets as { url?: string } | null;
    return {
      id: row.id,
      type: row.type as DemoDestination['type'],
      parentId: row.parent_id,
      slug: row.slug,
      slugPath: row.slug_path,
      name: String(tr.name ?? row.slug),
      tagline: String(tr.tagline ?? ''),
      overview: String(tr.overview ?? ''),
      image: hero?.url || '',
      featured: Boolean(row.featured),
      bestTimeToVisit: String(tr.best_time_to_visit ?? ''),
      currency: String(tr.currency ?? ''),
      languages: String(tr.languages ?? ''),
      timezone: String(tr.timezone ?? ''),
      visaInfo: String(tr.visa_info ?? ''),
      weather: String(tr.weather ?? ''),
      highlights: asArray<string>(tr.highlights),
      status: row.status as string,
    } as DemoDestination & { status?: string };
  });
}

async function mapHotels(db: Sb): Promise<(DemoHotel & { status?: string })[]> {
  const { data, error } = await db
    .from('hotels')
    .select(
      'id, slug, star_rating, destination_id, status, amenities, media_assets!hero_media_id(url), hotel_translations(*)',
    )
    .order('created_at', { ascending: false });
  if (error || !data?.length) return [];
  return data.map((row: any) => {
    const translations = row.hotel_translations as Array<Record<string, unknown>> | null;
    const tr = translations?.find((t) => t.locale === 'en') || translations?.[0] || {};
    const hero = row.media_assets as { url?: string } | null;
    return {
      id: row.id,
      slug: row.slug,
      name: String(tr.name ?? row.slug),
      locationLabel: String(tr.location_label ?? ''),
      description: String(tr.description ?? ''),
      starRating: Number(row.star_rating ?? 5),
      image: hero?.url || '',
      destinationId: row.destination_id || '',
      amenities: asArray<string>(row.amenities),
      status: row.status as string,
    };
  });
}

async function mapExperiences(db: Sb): Promise<(DemoExperience & { status?: string })[]> {
  const { data, error } = await db
    .from('experiences')
    .select(
      'id, slug, category, status, media_assets!hero_media_id(url), experience_translations(*)',
    )
    .order('sort_order', { ascending: true });
  if (error || !data?.length) return [];
  return data.map((row: any) => {
    const translations = row.experience_translations as Array<Record<string, unknown>> | null;
    const tr = translations?.find((t) => t.locale === 'en') || translations?.[0] || {};
    const hero = row.media_assets as { url?: string } | null;
    return {
      id: row.id,
      slug: row.slug,
      name: String(tr.name ?? row.slug),
      tagline: String(tr.tagline ?? ''),
      description: String(tr.description ?? ''),
      category: row.category as DemoExperience['category'],
      image: hero?.url || '',
      status: row.status as string,
    };
  });
}

async function mapItineraries(db: Sb): Promise<(DemoItinerary & { status?: string })[]> {
  const { data, error } = await db
    .from('itineraries')
    .select(
      'id, slug, status, duration_days, price_from, currency, included, excluded, media_assets!hero_media_id(url), itinerary_translations(*), itinerary_days(*, itinerary_day_translations(*)), itinerary_destinations(destination_id)',
    )
    .order('sort_order', { ascending: true });
  if (error || !data?.length) return [];

  return data.map((row: any) => {
    const translations = row.itinerary_translations as Array<Record<string, unknown>> | null;
    const tr = translations?.find((t) => t.locale === 'en') || translations?.[0] || {};
    const hero = row.media_assets as { url?: string } | null;
    const extras = includedExtras(row.included);
    const daysFromTable = asArray<Record<string, unknown>>(row.itinerary_days)
      .sort((a, b) => Number(a.day_number) - Number(b.day_number))
      .map((d) => {
        const dayTr = asArray<Record<string, unknown>>(d.itinerary_day_translations);
        const dtr = dayTr.find((t) => t.locale === 'en') || dayTr[0] || {};
        return {
          day: Number(d.day_number),
          title: String(dtr.title ?? `Day ${d.day_number}`),
          body: String(dtr.body ?? ''),
        };
      });
    const days = daysFromTable.length ? daysFromTable : extras.days;

    return {
      id: row.id,
      slug: row.slug,
      title: String(tr.title ?? row.slug),
      summary: String(tr.summary ?? ''),
      citiesLabel: String(tr.cities_label ?? ''),
      countryName: extras.countryName,
      durationDays: Number(row.duration_days ?? 7),
      priceFrom: Number(row.price_from ?? 0),
      currency: String(row.currency ?? 'EUR'),
      image: hero?.url || '',
      destinationIds: asArray<Record<string, string>>(row.itinerary_destinations).map(
        (d) => d.destination_id,
      ),
      placesLabel: extras.placesLabel,
      glanceStops: extras.glanceStops,
      places: extras.places,
      days,
      included: extras.items.length ? extras.items : asArray<string>(row.included),
      excluded: asArray<string>(row.excluded),
      flights: extras.flights,
      departureDates: extras.departureDates,
      terms: extras.terms,
      extensions: extras.extensions,
      status: row.status as string,
    };
  });
}

async function mapCollections(db: Sb): Promise<(DemoCollection & { status?: string })[]> {
  const { data, error } = await db
    .from('collections')
    .select(
      'id, slug, status, media_assets!hero_media_id(url), collection_translations(*)',
    )
    .order('sort_order', { ascending: true });
  if (error || !data?.length) return [];
  return data.map((row: any) => {
    const translations = row.collection_translations as Array<Record<string, unknown>> | null;
    const tr = translations?.find((t) => t.locale === 'en') || translations?.[0] || {};
    const hero = row.media_assets as { url?: string } | null;
    return {
      id: row.id,
      slug: row.slug,
      name: String(tr.name ?? row.slug),
      tagline: String(tr.tagline ?? ''),
      description: String(tr.description ?? ''),
      image: hero?.url || '',
      status: row.status as string,
    };
  });
}

async function mapBlog(db: Sb): Promise<(DemoBlogPost & { status?: string })[]> {
  const { data, error } = await db
    .from('blog_posts')
    .select(
      'id, slug, status, published_at, media_assets!cover_media_id(url), blog_authors(name), blog_categories(slug, blog_category_translations(*)), blog_post_translations(*)',
    )
    .order('published_at', { ascending: false });
  if (error || !data?.length) return [];
  return data.map((row: any) => {
    const translations = row.blog_post_translations as Array<Record<string, unknown>> | null;
    const tr = translations?.find((t) => t.locale === 'en') || translations?.[0] || {};
    const cover = row.media_assets as { url?: string } | null;
    const author = row.blog_authors as { name?: string } | null;
    const category = row.blog_categories as {
      slug?: string;
      blog_category_translations?: Array<Record<string, unknown>>;
    } | null;
    const catTr =
      category?.blog_category_translations?.find((t) => t.locale === 'en') ||
      category?.blog_category_translations?.[0];
    const body = tr.body;
    const bodyText = Array.isArray(body)
      ? body.map((b) => (typeof b === 'string' ? b : JSON.stringify(b))).join('\n\n')
      : String(body ?? '');
    return {
      id: row.id,
      slug: row.slug,
      title: String(tr.title ?? row.slug),
      excerpt: String(tr.excerpt ?? ''),
      body: bodyText,
      image: cover?.url || '',
      category: String(catTr?.name ?? category?.slug ?? ''),
      author: String(author?.name ?? ''),
      publishedAt: String(row.published_at ?? ''),
      status: row.status as string,
    };
  });
}

async function mapTestimonials(db: Sb): Promise<(DemoTestimonial & { status?: string })[]> {
  const { data, error } = await db
    .from('testimonials')
    .select('id, status, rating, testimonial_translations(*)')
    .order('sort_order', { ascending: true });
  if (error || !data?.length) return [];
  return data.map((row: any) => {
    const translations = row.testimonial_translations as Array<Record<string, unknown>> | null;
    const tr = translations?.find((t) => t.locale === 'en') || translations?.[0] || {};
    return {
      id: row.id,
      authorName: String(tr.author_name ?? ''),
      authorLocation: String(tr.author_location ?? ''),
      quote: String(tr.quote ?? ''),
      tripLabel: String(tr.trip_label ?? ''),
      rating: Number(row.rating ?? 5),
      status: row.status as string,
    };
  });
}

async function mapFaqs(db: Sb) {
  const { data, error } = await db
    .from('faqs')
    .select('id, status, faq_translations(*)')
    .order('sort_order', { ascending: true });
  if (error || !data?.length) return [];
  return data.map((row: any) => {
    const translations = row.faq_translations as Array<Record<string, unknown>> | null;
    const tr = translations?.find((t) => t.locale === 'en') || translations?.[0] || {};
    return {
      id: row.id,
      question: String(tr.question ?? ''),
      answer: String(tr.answer ?? ''),
      status: row.status as string,
    };
  });
}

async function mapEnquiries(db: Sb): Promise<DemoEnquiry[]> {
  const { data, error } = await db
    .from('enquiries')
    .select('*, destinations(slug_path, destination_translations(name, locale))')
    .order('created_at', { ascending: false });
  if (error || !data?.length) return [];
  return data.map((row: any) => {
    const dest = row.destinations as {
      slug_path?: string;
      destination_translations?: Array<{ name?: string; locale?: string }>;
    } | null;
    const destName =
      dest?.destination_translations?.find((t) => t.locale === 'en')?.name ||
      dest?.destination_translations?.[0]?.name ||
      dest?.slug_path ||
      '';
    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone || '',
      destination: destName,
      travelDate: row.travel_date || '',
      budget: row.budget || '',
      adults: row.adults,
      children: row.children,
      travelStyle: row.travel_style || '',
      notes: row.notes || '',
      status: row.status as DemoEnquiry['status'],
      createdAt: row.created_at,
    };
  });
}

export const destinationQueries = {
  getAll: async () => {
    const db = await publicDb();
    if (!db) return demoDestinations;
    const rows = onlyPublished(await mapDestinations(db));
    return rows.length ? rows : demoDestinations;
  },
  adminGetAll: async () => {
    const db = await adminDb();
    if (!db) return demoDestinations;
    const rows = await mapDestinations(db);
    return rows.length ? rows : demoDestinations;
  },
  getContinents: async () => {
    const all = await destinationQueries.getAll();
    return all.filter((d) => d.type === 'continent');
  },
  getChildren: async (parentId: string) => {
    const all = await destinationQueries.getAll();
    return all.filter((d) => d.parentId === parentId);
  },
  getBySlugPath: async (slugPath: string) => {
    const all = await destinationQueries.getAll();
    return all.find((d) => d.slugPath === slugPath);
  },
  getFeatured: async () => {
    const all = await destinationQueries.getAll();
    return all.filter((d) => d.featured && d.type !== 'city');
  },
  getCountries: async () => {
    const all = await destinationQueries.getAll();
    return all.filter((d) => d.type === 'country');
  },
  getCitiesByCountry: async (countryId: string) => {
    const all = await destinationQueries.getAll();
    return all.filter((d) => d.parentId === countryId && d.type === 'city');
  },
};

export const hotelQueries = {
  getAll: async () => {
    const db = await publicDb();
    if (!db) return demoHotels;
    const rows = onlyPublished(await mapHotels(db));
    return rows.length ? rows : demoHotels;
  },
  adminGetAll: async () => {
    const db = await adminDb();
    if (!db) return demoHotels;
    const rows = await mapHotels(db);
    return rows.length ? rows : demoHotels;
  },
  getBySlug: async (slug: string) => {
    const all = await hotelQueries.getAll();
    return all.find((h) => h.slug === slug);
  },
  getByDestination: async (destinationId: string) => {
    const all = await hotelQueries.getAll();
    return all.filter((h) => h.destinationId === destinationId);
  },
};

export const experienceQueries = {
  getAll: async () => {
    const db = await publicDb();
    if (!db) return demoExperiences;
    const rows = onlyPublished(await mapExperiences(db));
    return rows.length ? rows : demoExperiences;
  },
  adminGetAll: async () => {
    const db = await adminDb();
    if (!db) return demoExperiences;
    const rows = await mapExperiences(db);
    return rows.length ? rows : demoExperiences;
  },
  getBySlug: async (slug: string) => {
    const all = await experienceQueries.getAll();
    return all.find((e) => e.slug === slug);
  },
  getFeatured: async () => {
    const all = await experienceQueries.getAll();
    return all.slice(0, 6);
  },
};

export const itineraryQueries = {
  getAll: async () => {
    const db = await publicDb();
    if (!db) return demoItineraries;
    const rows = onlyPublished(await mapItineraries(db));
    if (!rows.length) return demoItineraries;
    return rows.map(enrichItineraryPackageFields);
  },
  adminGetAll: async () => {
    const db = await adminDb();
    if (!db) return demoItineraries.map((i) => ({ ...i, status: 'published' as const }));
    const rows = await mapItineraries(db);
    if (!rows.length) return demoItineraries.map((i) => ({ ...i, status: 'published' as const }));
    return rows.map(enrichItineraryPackageFields);
  },
  getBySlug: async (slug: string) => {
    const all = await itineraryQueries.getAll();
    return all.find((i) => i.slug === slug);
  },
  getFeatured: async () => itineraryQueries.getAll(),
  getByDestination: async (destinationId: string) => {
    const all = await itineraryQueries.getAll();
    return all.filter((i) => i.destinationIds.includes(destinationId));
  },
};

function enrichItineraryPackageFields<T extends DemoItinerary>(itin: T): T {
  const demo = demoItineraries.find((d) => d.slug === itin.slug);
  if (!demo) {
    return {
      ...itin,
      flights: itin.flights ?? [],
      departureDates: itin.departureDates ?? [],
      terms: itin.terms ?? [],
      days: itin.days ?? [],
      excluded: itin.excluded ?? [],
      included: itin.included ?? [],
      extensions: itin.extensions ?? [],
    };
  }
  return {
    ...itin,
    days: itin.days?.length ? itin.days : demo.days,
    flights: itin.flights?.length ? itin.flights : demo.flights,
    departureDates: itin.departureDates?.length ? itin.departureDates : demo.departureDates,
    terms: itin.terms?.length ? itin.terms : demo.terms,
    excluded: itin.excluded?.length ? itin.excluded : demo.excluded,
    included: itin.included?.length ? itin.included : demo.included,
    extensions: itin.extensions?.length ? itin.extensions : demo.extensions,
  };
}

export const collectionQueries = {
  getAll: async () => {
    const db = await publicDb();
    if (!db) return demoCollections;
    const rows = onlyPublished(await mapCollections(db));
    return rows.length ? rows : demoCollections;
  },
  adminGetAll: async () => {
    const db = await adminDb();
    if (!db) return demoCollections;
    const rows = await mapCollections(db);
    return rows.length ? rows : demoCollections;
  },
  getBySlug: async (slug: string) => {
    const all = await collectionQueries.getAll();
    return all.find((c) => c.slug === slug);
  },
};

export const blogQueries = {
  getAll: async () => {
    const db = await publicDb();
    if (!db) return demoBlogPosts;
    const rows = onlyPublished(await mapBlog(db));
    return rows.length ? rows : demoBlogPosts;
  },
  adminGetAll: async () => {
    const db = await adminDb();
    if (!db) return demoBlogPosts;
    const rows = await mapBlog(db);
    return rows.length ? rows : demoBlogPosts;
  },
  getBySlug: async (slug: string) => {
    const all = await blogQueries.getAll();
    return all.find((p) => p.slug === slug);
  },
  getFeatured: async () => {
    const all = await blogQueries.getAll();
    return all.slice(0, 3);
  },
};

export const testimonialQueries = {
  getAll: async () => {
    const db = await publicDb();
    if (!db) return demoTestimonials;
    const rows = onlyPublished(await mapTestimonials(db));
    return rows.length ? rows : demoTestimonials;
  },
  adminGetAll: async () => {
    const db = await adminDb();
    if (!db) return demoTestimonials;
    const rows = await mapTestimonials(db);
    return rows.length ? rows : demoTestimonials;
  },
};

export const faqQueries = {
  getAll: async () => {
    const db = await publicDb();
    if (!db) return demoFaqs;
    const rows = onlyPublished(await mapFaqs(db));
    return rows.length ? rows : demoFaqs;
  },
  adminGetAll: async () => {
    const db = await adminDb();
    if (!db) return demoFaqs;
    const rows = await mapFaqs(db);
    return rows.length ? rows : demoFaqs;
  },
};

export const enquiryQueries = {
  getAll: async () => {
    const db = await adminDb();
    if (!db) return demoEnquiries;
    const rows = await mapEnquiries(db);
    return rows.length ? rows : demoEnquiries;
  },
  getById: async (id: string) => {
    const all = await enquiryQueries.getAll();
    return all.find((e) => e.id === id);
  },
  getToday: async () => {
    const today = new Date().toISOString().slice(0, 10);
    const all = await enquiryQueries.getAll();
    return all.filter((e) => e.createdAt.startsWith(today));
  },
};

export const mediaQueries = {
  getFolders: async () => {
    const db = await adminDb();
    if (!db) return demoMediaFolders;
    const { data } = await db.from('media_folders').select('*').order('name');
    return data?.length
      ? data.map((f: any) => ({ id: f.id, name: f.name, slug: f.slug }))
      : demoMediaFolders;
  },
  getAssets: async () => {
    const db = await adminDb();
    if (!db) return demoMediaAssets;
    const { data } = await db.from('media_assets').select('*').order('created_at', { ascending: false });
    return data?.length
      ? data.map((a: any) => ({
          id: a.id,
          folderId: a.folder_id,
          url: a.url,
          title: a.title || '',
          alt: a.alt || '',
          mimeType: a.mime_type,
        }))
      : demoMediaAssets;
  },
  search: async (q: string) => {
    const assets = await mediaQueries.getAssets();
    const needle = q.toLowerCase();
    return assets.filter(
      (a: { title: string; alt: string; url: string }) =>
        a.title.toLowerCase().includes(needle) ||
        a.alt.toLowerCase().includes(needle) ||
        a.url.toLowerCase().includes(needle),
    );
  },
};

export const settingsQueries = {
  getBrand: async () => {
    const db = await publicDb();
    if (!db) {
      const { siteSettings } = await import('@/data/demo');
      return siteSettings;
    }
    const { data } = await db.from('site_settings').select('value').eq('key', 'brand').maybeSingle();
    if (!data?.value) {
      const { siteSettings } = await import('@/data/demo');
      return siteSettings;
    }
    const v = data.value as Record<string, unknown>;
    return {
      brandName: String(v.name ?? 'Uncharted Journeys'),
      phone: String(v.phone ?? ''),
      email: String(v.email ?? ''),
      address: String(v.address ?? ''),
      socials: (v.socials as Record<string, string>) || {},
    };
  },
};
