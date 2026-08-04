'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  SAVED_DESTINATIONS_KEY,
  type ExploreCountry,
} from '@/data/explore-destinations';

export type SavedDestination = {
  slug: string;
  name: string;
  slugPath: string;
  blurb: string;
  continentSlug: string;
};

const MAX_SAVED = 3;

export function useSavedDestinations() {
  const [saved, setSaved] = useState<SavedDestination[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_DESTINATIONS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedDestination[];
        if (Array.isArray(parsed)) setSaved(parsed.slice(0, MAX_SAVED));
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(SAVED_DESTINATIONS_KEY, JSON.stringify(saved));
  }, [saved, ready]);

  const isSaved = useCallback(
    (slug: string) => saved.some((s) => s.slug === slug),
    [saved],
  );

  const toggle = useCallback((country: ExploreCountry | SavedDestination) => {
    setSaved((prev) => {
      const exists = prev.some((s) => s.slug === country.slug);
      if (exists) return prev.filter((s) => s.slug !== country.slug);

      const next: SavedDestination = {
        slug: country.slug,
        name: country.name,
        slugPath: country.slugPath,
        blurb: country.blurb,
        continentSlug: country.continentSlug,
      };

      return [next, ...prev.filter((s) => s.slug !== next.slug)].slice(0, MAX_SAVED);
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setSaved((prev) => prev.filter((s) => s.slug !== slug));
  }, []);

  const clear = useCallback(() => setSaved([]), []);

  return { saved, ready, isSaved, toggle, remove, clear, max: MAX_SAVED };
}
