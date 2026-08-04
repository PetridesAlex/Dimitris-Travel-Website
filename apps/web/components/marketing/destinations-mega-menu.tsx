'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { getContinents, getChildren } from '@/data/demo';
import { cn } from '@/lib/utils';

export type NavContinent = {
  id: string;
  name: string;
  slug: string;
  slugPath: string;
  tagline: string;
  image: string;
  countries: {
    id: string;
    name: string;
    slug: string;
    slugPath: string;
    cities: { id: string; name: string; slug: string; slugPath: string }[];
  }[];
};

export function buildDestinationNavTree(): NavContinent[] {
  return getContinents().map((continent) => ({
    id: continent.id,
    name: continent.name,
    slug: continent.slug,
    slugPath: continent.slugPath,
    tagline: continent.tagline,
    image: continent.image,
    countries: getChildren(continent.id).map((country) => ({
      id: country.id,
      name: country.name,
      slug: country.slug,
      slugPath: country.slugPath,
      cities: getChildren(country.id).map((city) => ({
        id: city.id,
        name: city.name,
        slug: city.slug,
        slugPath: city.slugPath,
      })),
    })),
  }));
}

export function DestinationsMegaMenu({
  locale,
  onNavigate,
}: {
  locale: string;
  onNavigate?: () => void;
}) {
  const tree = useMemo(() => buildDestinationNavTree(), []);
  const [activeId, setActiveId] = useState(tree[0]?.id ?? '');
  const reduce = useReducedMotion();
  const prefix = `/${locale}`;
  const active = tree.find((c) => c.id === activeId) ?? tree[0];

  if (!active) return null;

  return (
    <div className="relative border-t border-[#c5a059]/20 bg-[#0c0c0c]/98 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/45 to-transparent" />

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[260px_1fr_280px]">
        {/* Continent rail */}
        <div className="border-b border-white/10 px-5 py-6 lg:border-r lg:border-b-0 lg:px-7 lg:py-8">
          <p className="mb-5 text-[10px] font-semibold tracking-[0.35em] text-[#c5a059] uppercase">
            Continents
          </p>
          <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            {tree.map((continent, index) => {
              const isActive = continent.id === active.id;
              return (
                <li key={continent.id} className="shrink-0">
                  <button
                    type="button"
                    onMouseEnter={() => setActiveId(continent.id)}
                    onFocus={() => setActiveId(continent.id)}
                    onClick={() => setActiveId(continent.id)}
                    className={cn(
                      'group relative flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-all duration-300',
                      'lg:border-l-[2px] lg:pl-5',
                      isActive
                        ? 'border-[#c5a059] bg-gradient-to-r from-[#c5a059]/12 to-transparent text-[#c5a059]'
                        : 'border-transparent text-white/50 hover:border-white/25 hover:bg-white/[0.03] hover:text-white',
                    )}
                  >
                    <span className="flex min-w-0 items-start gap-3.5">
                      <span
                        className={cn(
                          'mt-0.5 hidden font-[family-name:var(--font-display)] text-[13px] tracking-[0.18em] lg:inline',
                          isActive ? 'text-[#c5a059]' : 'text-[#c5a059]/40 group-hover:text-[#c5a059]/70',
                        )}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span
                        className={cn(
                          'font-[family-name:var(--font-display)] text-[17px] leading-snug font-semibold tracking-[0.04em] uppercase md:text-[18px]',
                          isActive && 'text-[#c5a059]',
                        )}
                      >
                        {continent.name}
                      </span>
                    </span>
                    <ChevronRight
                      className={cn(
                        'hidden h-4 w-4 shrink-0 transition duration-300 lg:block',
                        isActive
                          ? 'translate-x-0.5 text-[#c5a059]'
                          : 'text-white/15 group-hover:translate-x-0.5 group-hover:text-white/45',
                      )}
                      strokeWidth={1.5}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Countries + cities */}
        <div className="px-5 py-6 lg:px-8 lg:py-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.32em] text-[#c5a059] uppercase">
                Countries
              </p>
              <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-[1.75rem] font-semibold leading-none tracking-[0.02em] text-white">
                {active.name}
              </h3>
              <p className="mt-2 max-w-md text-[13px] leading-relaxed text-white/45">
                {active.tagline}
              </p>
            </div>
            <Link
              href={`${prefix}/destinations/${active.slugPath}`}
              onClick={onNavigate}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.2em] text-white/60 uppercase transition hover:text-[#c5a059]"
            >
              Explore continent
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="grid max-h-[min(52vh,440px)] grid-cols-1 gap-x-6 gap-y-1 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3"
            >
              {active.countries.map((country, index) => (
                <div
                  key={country.id}
                  className="group/item relative min-w-0 border-b border-white/[0.07] py-4 transition-colors duration-300 hover:border-[#c5a059]/30"
                >
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.16em] text-[#c5a059]/55 transition-colors group-hover/item:text-[#c5a059]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Link
                      href={`${prefix}/destinations/${country.slugPath}`}
                      onClick={onNavigate}
                      className="group inline-flex min-w-0 items-center gap-2"
                    >
                      <span className="font-[family-name:var(--font-display)] text-[18px] font-semibold leading-none tracking-[0.02em] text-white transition-colors duration-300 group-hover:text-[#c5a059]">
                        {country.name}
                      </span>
                      <ArrowUpRight
                        className="h-3.5 w-3.5 shrink-0 text-transparent transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#c5a059]"
                        strokeWidth={1.75}
                      />
                    </Link>
                  </div>

                  {country.cities.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-x-1 gap-y-1.5 pl-[1.65rem]">
                      {country.cities.map((city, cityIndex) => (
                        <li key={city.id} className="flex items-center">
                          {cityIndex > 0 ? (
                            <span className="mx-1.5 text-[10px] text-[#c5a059]/35" aria-hidden>
                              ·
                            </span>
                          ) : null}
                          <Link
                            href={`${prefix}/destinations/${city.slugPath}`}
                            onClick={onNavigate}
                            className="text-[12px] font-medium tracking-[0.06em] text-white/55 transition-colors duration-300 hover:text-[#c5a059]"
                          >
                            {city.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2.5 pl-[1.65rem] text-[11px] font-medium tracking-[0.12em] text-white/30">
                      Explore country
                    </p>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 border-t border-white/10 pt-5">
            <Link
              href={`${prefix}/destinations`}
              onClick={onNavigate}
              className="inline-flex items-center gap-2 border border-[#c5a059]/40 px-4 py-2.5 text-[10px] font-semibold tracking-[0.22em] text-[#c5a059] uppercase transition hover:border-[#c5a059] hover:bg-[#c5a059] hover:text-[#0c0c0c]"
            >
              View all destinations
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        {/* Featured visual */}
        <Link
          href={`${prefix}/destinations/${active.slugPath}`}
          onClick={onNavigate}
          className="group relative hidden min-h-[280px] overflow-hidden lg:block"
        >
          <Image
            src={active.image}
            alt={active.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="280px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-[10px] tracking-[0.28em] text-[#c5a059] uppercase">Featured</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white">
              {active.name}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-white/60">{active.tagline}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export function DestinationsMobileAccordion({
  locale,
  onNavigate,
}: {
  locale: string;
  onNavigate?: () => void;
}) {
  const tree = useMemo(() => buildDestinationNavTree(), []);
  const [openContinent, setOpenContinent] = useState<string | null>(null);
  const prefix = `/${locale}`;

  return (
    <div className="border-b border-white/[0.08] pb-4">
      <p className="mb-3 text-[10px] font-medium tracking-[0.28em] text-[#c5a059]/80 uppercase">
        Destinations
      </p>
      <div className="space-y-1">
        {tree.map((continent) => {
          const open = openContinent === continent.id;
          return (
            <div key={continent.id}>
              <button
                type="button"
                onClick={() => setOpenContinent(open ? null : continent.id)}
                className="flex w-full items-center justify-between py-2.5 text-left"
              >
                <span className="text-[13px] font-semibold tracking-[0.14em] text-white uppercase">
                  {continent.name}
                </span>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 text-[#c5a059]/70 transition-transform',
                    open && 'rotate-90',
                  )}
                  strokeWidth={1.5}
                />
              </button>
              <AnimatePresence initial={false}>
                {open ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-3 pb-4 pl-1">
                      <li>
                        <Link
                          href={`${prefix}/destinations/${continent.slugPath}`}
                          onClick={onNavigate}
                          className="text-[11px] tracking-[0.18em] text-[#c5a059] uppercase"
                        >
                          All {continent.name}
                        </Link>
                      </li>
                      {continent.countries.map((country) => (
                        <li key={country.id}>
                          <Link
                            href={`${prefix}/destinations/${country.slugPath}`}
                            onClick={onNavigate}
                            className="font-[family-name:var(--font-display)] text-[15px] text-white/85"
                          >
                            {country.name}
                          </Link>
                          {country.cities.length > 0 ? (
                            <ul className="mt-1.5 space-y-1 pl-3">
                              {country.cities.map((city) => (
                                <li key={city.id}>
                                  <Link
                                    href={`${prefix}/destinations/${city.slugPath}`}
                                    onClick={onNavigate}
                                    className="text-[12px] text-white/45"
                                  >
                                    {city.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <Link
        href={`${prefix}/destinations`}
        onClick={onNavigate}
        className="mt-2 inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] text-white/50 uppercase hover:text-[#c5a059]"
      >
        View all destinations
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </Link>
    </div>
  );
}
