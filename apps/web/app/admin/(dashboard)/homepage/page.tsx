/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdminPageHeader } from '@/components/admin/page-header';
import {
  HomepageSectionsEditor,
  type HomeSection,
} from '@/components/admin/homepage-editor';
import { createServiceClient } from '@/lib/supabase/server';

const DEFAULT_SECTIONS: HomeSection[] = [
  { id: 'hero', type: 'hero', label: 'Luxury Hero', enabled: true },
  { id: 'trust_bar', type: 'trust_bar', label: 'Trust / Features Bar', enabled: true },
  { id: 'continents', type: 'continents', label: 'Explore by Continent', enabled: true },
  { id: 'experiences', type: 'experiences', label: 'Featured Experiences', enabled: true },
  { id: 'itineraries', type: 'itineraries', label: 'Signature Journeys', enabled: true },
  { id: 'testimonials', type: 'testimonials', label: 'Testimonials', enabled: true },
  { id: 'blog', type: 'blog', label: 'Travel Inspiration', enabled: true },
  { id: 'newsletter', type: 'newsletter', label: 'Newsletter', enabled: true },
  { id: 'cta_band', type: 'cta_band', label: 'Plan Your Journey CTA', enabled: true },
];

export default async function AdminHomepagePage() {
  const db = createServiceClient();
  let sections = DEFAULT_SECTIONS;

  if (db) {
    const { data: page } = await (db as any)
      .from('pages')
      .select('sections')
      .eq('slug', 'home')
      .maybeSingle();

    if (page?.sections && Array.isArray(page.sections) && page.sections.length) {
      const stored = page.sections as { id?: string; type?: string; enabled?: boolean }[];
      sections = DEFAULT_SECTIONS.map((def) => {
        const match =
          stored.find((s) => s.id === def.id) ||
          stored.find((s) => s.type === def.type);
        return {
          ...def,
          enabled: match?.enabled ?? def.enabled,
        };
      });
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Homepage builder"
        description="Toggle homepage sections. Order matches the default layout."
      />
      <HomepageSectionsEditor initial={sections} />
    </div>
  );
}
