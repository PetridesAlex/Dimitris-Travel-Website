'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Heart,
  Sparkles,
  X,
} from 'lucide-react';
import {
  continentMapRegions,
  WORLD_MAP_VIEWBOX,
  type ContinentSlug,
} from '@/data/world-map-continents';
import {
  continentHasMatches,
  countryMatchesFilters,
  exploreCountries,
  JOURNEY_MOODS,
  pickInspiredCountry,
  SEASONS,
  type ExploreCountry,
  type JourneyMood,
  type Season,
} from '@/data/explore-destinations';
import {
  buildDestinationNavTree,
  type NavContinent,
} from '@/components/marketing/destinations-mega-menu';
import { useSavedDestinations } from '@/hooks/use-saved-destinations';
import { cn } from '@/lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

function matchContinent(tree: NavContinent[], slug: ContinentSlug) {
  return tree.find((c) => c.slug === slug) ?? null;
}

export function WorldExploreMap({ locale }: { locale: string }) {
  const tree = useMemo(() => buildDestinationNavTree(), []);
  const reduce = useReducedMotion();
  const prefix = `/${locale}`;
  const { saved, isSaved, toggle, remove, max } = useSavedDestinations();

  const [activeSlug, setActiveSlug] = useState<ContinentSlug | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<ContinentSlug | null>(null);
  const [mood, setMood] = useState<JourneyMood | null>(null);
  const [season, setSeason] = useState<Season | null>(null);
  const [focusedCountry, setFocusedCountry] = useState<ExploreCountry | null>(null);
  const [inspiration, setInspiration] = useState<ExploreCountry | null>(null);
  const [inspiring, setInspiring] = useState(false);
  const [mapPulse, setMapPulse] = useState(0);

  const activeRegion = activeSlug
    ? continentMapRegions.find((r) => r.slug === activeSlug)
    : null;
  const activeDest = activeSlug ? matchContinent(tree, activeSlug) : null;

  const focus = activeRegion?.focus ?? ([0, 0, 1000, 500] as const);
  const viewBox = `${focus[0]} ${focus[1]} ${focus[2]} ${focus[3]}`;

  const matchingSlugs = useMemo(() => {
    const set = new Set(
      exploreCountries
        .filter((c) => countryMatchesFilters(c, mood, season))
        .map((c) => c.slug),
    );
    return set;
  }, [mood, season]);

  const filtersActive = mood !== null || season !== null;

  const visibleCountries = useMemo(() => {
    if (activeSlug) {
      return exploreCountries.filter(
        (c) =>
          c.continentSlug === activeSlug &&
          countryMatchesFilters(c, mood, season),
      );
    }
    return exploreCountries.filter((c) => countryMatchesFilters(c, mood, season));
  }, [activeSlug, mood, season]);

  const selectContinent = useCallback((slug: ContinentSlug | null) => {
    setActiveSlug(slug);
    setFocusedCountry(null);
    setInspiration(null);
  }, []);

  const focusCountry = useCallback((country: ExploreCountry) => {
    setActiveSlug(country.continentSlug);
    setFocusedCountry(country);
    setInspiration(null);
  }, []);

  const handleInspire = useCallback(() => {
    if (inspiring) return;
    const exclude = inspiration?.slug;
    setInspiring(true);
    setFocusedCountry(null);
    setInspiration(null);
    setMapPulse((n) => n + 1);

    const pick = pickInspiredCountry(mood, season, exclude);
    let tick = 0;
    const flash = window.setInterval(() => {
      tick += 1;
      const temp = pickInspiredCountry(mood, season);
      setActiveSlug(temp.continentSlug);
      setFocusedCountry(temp);
      if (tick >= 5) {
        window.clearInterval(flash);
        setActiveSlug(pick.continentSlug);
        setFocusedCountry(pick);
        setInspiration(pick);
        setInspiring(false);
      }
    }, reduce ? 40 : 180);
  }, [inspiring, mood, season, inspiration?.slug, reduce]);

  return (
    <div className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[#0c0c0c]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(197,160,89,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_75%,rgba(197,160,89,0.06),transparent_45%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(197,160,89,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(197,160,89,0.5) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Header + filters */}
      <div className="relative z-20 mx-auto max-w-[1600px] px-5 pt-28 pb-6 sm:px-6 lg:px-8 lg:pt-32">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="max-w-xl"
          >
            <p className="text-[11px] font-semibold tracking-[0.38em] text-[#c5a059] uppercase">
              Explore the world
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
              What are you
              <span className="mt-1 block text-[#c5a059]">dreaming of?</span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/50">
              Shape the map around your mood and season — then save destinations to
              your Journey Board.
            </p>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="flex flex-wrap items-center gap-3 lg:justify-end"
          >
            <button
              type="button"
              onClick={handleInspire}
              disabled={inspiring}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden border border-[#c5a059] bg-gradient-to-r from-[#a8863f] via-[#c5a059] to-[#d4b56e] px-5 py-3 text-[11px] font-semibold tracking-[0.22em] text-[#0c0c0c] uppercase shadow-[0_16px_40px_-18px_rgba(197,160,89,0.9)] transition hover:brightness-105 disabled:opacity-70"
            >
              {!reduce ? (
                <motion.span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/35 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 1.2,
                  }}
                />
              ) : null}
              <Sparkles className="relative h-3.5 w-3.5" strokeWidth={1.75} />
              <span className="relative">{inspiring ? 'Finding…' : 'Inspire Me'}</span>
            </button>

            {(mood || season || activeSlug) && (
              <button
                type="button"
                onClick={() => {
                  setMood(null);
                  setSeason(null);
                  selectContinent(null);
                  setFocusedCountry(null);
                  setInspiration(null);
                }}
                className="border border-white/15 px-4 py-3 text-[10px] font-semibold tracking-[0.2em] text-white/45 uppercase transition hover:border-white/30 hover:text-white/70"
              >
                Reset
              </button>
            )}
          </motion.div>
        </div>

        {/* Mood selector */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease }}
          className="mt-10"
        >
          <p className="mb-3 text-[10px] font-semibold tracking-[0.32em] text-[#c5a059]/80 uppercase">
            Journey mood
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {JOURNEY_MOODS.map((m) => {
              const on = mood === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood((prev) => (prev === m ? null : m))}
                  className={cn(
                    'shrink-0 border px-4 py-2.5 text-[11px] font-medium tracking-[0.06em] transition duration-300',
                    on
                      ? 'border-[#c5a059] bg-[#c5a059]/15 text-[#c5a059]'
                      : 'border-white/12 text-white/50 hover:border-[#c5a059]/40 hover:text-white/80',
                  )}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Season + continent chips */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease }}
          className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="mb-3 text-[10px] font-semibold tracking-[0.32em] text-[#c5a059]/80 uppercase">
              Best season
            </p>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => {
                const on = season === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeason((prev) => (prev === s ? null : s))}
                    className={cn(
                      'border px-4 py-2 text-[10px] font-semibold tracking-[0.2em] uppercase transition duration-300',
                      on
                        ? 'border-[#c5a059] bg-[#c5a059] text-[#0c0c0c]'
                        : 'border-white/12 text-white/45 hover:border-[#c5a059]/45 hover:text-[#c5a059]',
                    )}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            {continentMapRegions.map((region) => {
              const isOn = activeSlug === region.slug;
              const hasMatch =
                !filtersActive || continentHasMatches(region.slug, mood, season);
              return (
                <button
                  key={region.slug}
                  type="button"
                  disabled={filtersActive && !hasMatch}
                  onClick={() =>
                    selectContinent(isOn ? null : region.slug)
                  }
                  className={cn(
                    'border px-3 py-2 text-[10px] font-semibold tracking-[0.18em] uppercase transition duration-300',
                    isOn
                      ? 'border-[#c5a059] bg-[#c5a059]/20 text-[#c5a059]'
                      : hasMatch
                        ? 'border-white/12 text-white/40 hover:border-[#c5a059]/40 hover:text-[#c5a059]'
                        : 'cursor-not-allowed border-white/5 text-white/15',
                  )}
                >
                  {region.label.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Map + side column */}
      <div className="relative z-10 mx-auto grid max-w-[1600px] gap-6 px-4 pb-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8 lg:pb-16 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="relative space-y-4">
          <motion.div
            key={mapPulse}
            className="relative aspect-[2/1] w-full overflow-hidden border border-[#c5a059]/15 bg-[#0a0a0a]/85 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]"
            initial={reduce ? false : { opacity: 0.85, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(12,12,12,0.55)_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent" />

            <motion.svg
              viewBox={WORLD_MAP_VIEWBOX}
              initial={false}
              animate={
                reduce || !activeSlug
                  ? { viewBox: WORLD_MAP_VIEWBOX }
                  : { viewBox }
              }
              transition={{ duration: 0.95, ease }}
              className="h-full w-full"
              role="img"
              aria-label="Interactive world map of travel destinations"
            >
              <rect width="1000" height="500" fill="#0c0c0c" />
              <defs>
                <linearGradient id="continentFill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#c5a059" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#c5a059" stopOpacity="0.08" />
                </linearGradient>
                <linearGradient id="continentActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4b56e" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#c5a059" stopOpacity="0.28" />
                </linearGradient>
                <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#c5a059" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#c5a059" stopOpacity="0" />
                </radialGradient>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {[100, 200, 250, 300, 400].map((y) => (
                <line
                  key={y}
                  x1="40"
                  x2="960"
                  y1={y}
                  y2={y}
                  stroke="rgba(197,160,89,0.07)"
                  strokeWidth="0.5"
                  strokeDasharray="4 8"
                />
              ))}

              {continentMapRegions.map((region) => {
                const isActive = activeSlug === region.slug;
                const isHovered = hoveredSlug === region.slug;
                const hasMatch =
                  !filtersActive || continentHasMatches(region.slug, mood, season);
                const dimmed =
                  (activeSlug !== null && !isActive) ||
                  (filtersActive && !hasMatch && !isActive);

                return (
                  <g
                    key={region.slug}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    aria-label={`Explore ${region.label}`}
                    className="cursor-pointer outline-none"
                    onMouseEnter={() => setHoveredSlug(region.slug)}
                    onMouseLeave={() => setHoveredSlug(null)}
                    onClick={() => selectContinent(isActive ? null : region.slug)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectContinent(isActive ? null : region.slug);
                      }
                    }}
                    style={{
                      opacity: dimmed ? 0.18 : 1,
                      transition: 'opacity 0.45s ease',
                      filter:
                        isActive || isHovered || (filtersActive && hasMatch && !activeSlug)
                          ? 'url(#glow)'
                          : undefined,
                    }}
                  >
                    {region.paths.map((d, i) => (
                      <path
                        key={i}
                        d={d}
                        fill={
                          isActive || (filtersActive && hasMatch && !activeSlug)
                            ? 'url(#continentActive)'
                            : isHovered
                              ? 'url(#continentFill)'
                              : 'rgba(197,160,89,0.1)'
                        }
                        stroke={
                          isActive || isHovered || (filtersActive && hasMatch)
                            ? '#c5a059'
                            : 'rgba(197,160,89,0.28)'
                        }
                        strokeWidth={isActive ? 1.6 : 0.85}
                        className="transition-[fill,stroke-width] duration-300"
                      />
                    ))}
                    <text
                      x={region.labelAt[0]}
                      y={region.labelAt[1]}
                      textAnchor="middle"
                      className="pointer-events-none select-none"
                      fill={
                        isActive || isHovered || (filtersActive && hasMatch)
                          ? '#c5a059'
                          : 'rgba(255,255,255,0.35)'
                      }
                      style={{
                        fontSize: 11,
                        letterSpacing: '0.22em',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
                      {region.label.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Destination pins */}
              {exploreCountries.map((country) => {
                const match = matchingSlugs.has(country.slug);
                const focused = focusedCountry?.slug === country.slug;
                const savedPin = isSaved(country.slug);
                const inView =
                  !activeSlug || country.continentSlug === activeSlug;
                if (!inView && !focused) return null;
                if (filtersActive && !match && !focused) return null;

                return (
                  <g
                    key={country.slug}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      focusCountry(country);
                    }}
                  >
                    {(focused || (filtersActive && match)) && (
                      <circle
                        cx={country.x}
                        cy={country.y}
                        r={focused ? 18 : 12}
                        fill="url(#pinGlow)"
                        opacity={focused ? 0.85 : 0.55}
                      >
                        {!reduce ? (
                          <animate
                            attributeName="r"
                            values={focused ? '14;22;14' : '10;14;10'}
                            dur={focused ? '1.6s' : '2.4s'}
                            repeatCount="indefinite"
                          />
                        ) : null}
                      </circle>
                    )}
                    <circle
                      cx={country.x}
                      cy={country.y}
                      r={focused ? 4.5 : 3}
                      fill={focused || savedPin ? '#c5a059' : '#f7f3eb'}
                      stroke="#0c0c0c"
                      strokeWidth="1"
                    />
                    {(focused || activeSlug === country.continentSlug) && (
                      <text
                        x={country.x}
                        y={country.y - 10}
                        textAnchor="middle"
                        fill="#c5a059"
                        style={{ fontSize: 8, letterSpacing: '0.08em' }}
                        className="pointer-events-none"
                      >
                        {country.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </motion.svg>

            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <p className="text-[10px] tracking-[0.24em] text-white/30 uppercase">
                {filtersActive
                  ? `${visibleCountries.length} matching destinations`
                  : activeSlug
                    ? 'Select a destination pin'
                    : 'Choose a mood — or click a continent'}
              </p>
            </div>
          </motion.div>

          {/* Inspiration reveal */}
          <AnimatePresence mode="wait">
            {inspiration ? (
              <motion.div
                key={inspiration.slug}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.45, ease }}
                className="relative overflow-hidden border border-[#c5a059]/35 bg-gradient-to-r from-[#c5a059]/12 via-[#0c0c0c] to-[#0c0c0c] px-5 py-5 sm:px-7 sm:py-6"
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-[#c5a059]" />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.32em] text-[#c5a059] uppercase">
                      Your next journey
                    </p>
                    <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-white sm:text-4xl">
                      {inspiration.name}
                    </p>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/55">
                      {inspiration.blurb}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggle(inspiration)}
                      className={cn(
                        'inline-flex items-center gap-2 border px-4 py-2.5 text-[10px] font-semibold tracking-[0.18em] uppercase transition',
                        isSaved(inspiration.slug)
                          ? 'border-[#c5a059] bg-[#c5a059] text-[#0c0c0c]'
                          : 'border-[#c5a059]/45 text-[#c5a059] hover:bg-[#c5a059]/10',
                      )}
                    >
                      <Heart
                        className="h-3.5 w-3.5"
                        strokeWidth={1.5}
                        fill={isSaved(inspiration.slug) ? 'currentColor' : 'none'}
                      />
                      {isSaved(inspiration.slug) ? 'Saved' : 'Save'}
                    </button>
                    <Link
                      href={`${prefix}/destinations/${inspiration.slugPath}`}
                      className="inline-flex items-center gap-2 border border-white/20 px-4 py-2.5 text-[10px] font-semibold tracking-[0.18em] text-white/70 uppercase transition hover:border-[#c5a059]/50 hover:text-[#c5a059]"
                    >
                      Explore
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Side column: panel + journey board */}
        <div className="flex flex-col gap-4">
          <div className="relative hidden min-h-[280px] flex-1 lg:block">
            <AnimatePresence mode="wait">
              {focusedCountry ? (
                <CountryFocusPanel
                  key={focusedCountry.slug}
                  country={focusedCountry}
                  prefix={prefix}
                  saved={isSaved(focusedCountry.slug)}
                  onToggleSave={() => toggle(focusedCountry)}
                  onClose={() => setFocusedCountry(null)}
                  reduce={!!reduce}
                />
              ) : activeDest && activeRegion ? (
                <ContinentPanel
                  key={activeDest.id}
                  dest={activeDest}
                  countries={visibleCountries}
                  prefix={prefix}
                  isSaved={isSaved}
                  onToggleSave={toggle}
                  onSelectCountry={focusCountry}
                  onClose={() => selectContinent(null)}
                  reduce={!!reduce}
                  mood={mood}
                  season={season}
                />
              ) : (
                <motion.div
                  key="idle"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col justify-center border border-[#c5a059]/15 bg-white/[0.02] px-7 py-9"
                >
                  <Compass className="h-7 w-7 text-[#c5a059]/70" strokeWidth={1.25} />
                  <p className="mt-5 text-[11px] font-semibold tracking-[0.32em] text-[#c5a059] uppercase">
                    Begin here
                  </p>
                  <p className="mt-3 font-[family-name:var(--font-display)] text-2xl leading-snug text-white xl:text-3xl">
                    Pick a mood, a season, or tap the map — destinations will glow to
                    match.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <JourneyBoard
            saved={saved}
            max={max}
            prefix={prefix}
            onRemove={remove}
            onSelect={(slug) => {
              const c = exploreCountries.find((x) => x.slug === slug);
              if (c) focusCountry(c);
            }}
          />
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {(focusedCountry || (activeDest && activeRegion)) && (
          <motion.div
            className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.45, ease }}
          >
            <div className="max-h-[68vh] overflow-y-auto border-t border-[#c5a059]/30 bg-[#0c0c0c]/96 px-5 pt-4 pb-8 shadow-[0_-30px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl">
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
              {focusedCountry ? (
                <CountryFocusPanel
                  country={focusedCountry}
                  prefix={prefix}
                  saved={isSaved(focusedCountry.slug)}
                  onToggleSave={() => toggle(focusedCountry)}
                  onClose={() => setFocusedCountry(null)}
                  reduce={!!reduce}
                  compact
                />
              ) : activeDest ? (
                <ContinentPanel
                  dest={activeDest}
                  countries={visibleCountries}
                  prefix={prefix}
                  isSaved={isSaved}
                  onToggleSave={toggle}
                  onSelectCountry={focusCountry}
                  onClose={() => selectContinent(null)}
                  reduce={!!reduce}
                  mood={mood}
                  season={season}
                  compact
                />
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CountryFocusPanel({
  country,
  prefix,
  saved,
  onToggleSave,
  onClose,
  reduce,
  compact = false,
}: {
  country: ExploreCountry;
  prefix: string;
  saved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
  reduce: boolean;
  compact?: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? undefined : { opacity: 0, x: 12 }}
      transition={{ duration: 0.4, ease }}
      className={cn(
        'relative flex h-full flex-col border border-[#c5a059]/25 bg-[#0c0c0c] p-6',
        compact && 'border-0 bg-transparent p-0',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.32em] text-[#c5a059] uppercase">
            Destination
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl text-white">
            {country.name}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onToggleSave}
            aria-label={saved ? 'Remove from Journey Board' : 'Save to Journey Board'}
            className={cn(
              'flex h-9 w-9 items-center justify-center border transition',
              saved
                ? 'border-[#c5a059] bg-[#c5a059] text-[#0c0c0c]'
                : 'border-white/20 text-white/60 hover:border-[#c5a059] hover:text-[#c5a059]',
            )}
          >
            <Heart className="h-4 w-4" strokeWidth={1.5} fill={saved ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/60 transition hover:border-[#c5a059] hover:text-[#c5a059]"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-white/55">{country.blurb}</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {country.moods.slice(0, 4).map((m) => (
          <span
            key={m}
            className="border border-[#c5a059]/25 px-2.5 py-1 text-[9px] tracking-[0.14em] text-[#c5a059]/80 uppercase"
          >
            {m}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <Link
          href={`${prefix}/destinations/${country.slugPath}`}
          className="group inline-flex w-full items-center justify-center gap-2 border border-[#c5a059]/45 bg-[#c5a059]/10 px-5 py-3.5 text-[11px] font-semibold tracking-[0.22em] text-[#c5a059] uppercase transition hover:border-[#c5a059] hover:bg-[#c5a059] hover:text-[#0c0c0c]"
        >
          Discover {country.name}
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
        </Link>
      </div>
    </motion.div>
  );
}

function ContinentPanel({
  dest,
  countries,
  prefix,
  isSaved,
  onToggleSave,
  onSelectCountry,
  onClose,
  reduce,
  mood,
  season,
  compact = false,
}: {
  dest: NavContinent;
  countries: ExploreCountry[];
  prefix: string;
  isSaved: (slug: string) => boolean;
  onToggleSave: (c: ExploreCountry) => void;
  onSelectCountry: (c: ExploreCountry) => void;
  onClose: () => void;
  reduce: boolean;
  mood: JourneyMood | null;
  season: Season | null;
  compact?: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? undefined : { opacity: 0, x: 14 }}
      transition={{ duration: 0.45, ease }}
      className={cn(
        'relative flex h-full flex-col overflow-hidden border border-[#c5a059]/20 bg-[#0c0c0c]',
        compact && 'border-0 bg-transparent',
      )}
    >
      {!compact ? (
        <div className="relative h-32 shrink-0 overflow-hidden">
          <Image src={dest.image} alt={dest.name} fill className="object-cover" sizes="380px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/45 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center border border-white/20 bg-black/40 text-white/80 backdrop-blur-sm transition hover:border-[#c5a059] hover:text-[#c5a059]"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      ) : (
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-semibold tracking-[0.32em] text-[#c5a059] uppercase">
            Continent
          </p>
          <button type="button" onClick={onClose} aria-label="Close" className="text-white/50">
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      )}

      <div className={cn('flex flex-1 flex-col px-5 pt-4 pb-5', compact && 'px-0 pt-0')}>
        <p className="text-[10px] font-semibold tracking-[0.28em] text-[#c5a059] uppercase">
          {String(countries.length).padStart(2, '0')} destinations
          {(mood || season) && ' · filtered'}
        </p>
        <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-3xl leading-tight text-white">
          {dest.name}
        </h2>
        <p className="mt-2 text-sm text-white/45">{dest.tagline}</p>

        <ul className="mt-4 max-h-[220px] space-y-0 overflow-y-auto pr-1">
          {countries.length === 0 ? (
            <li className="py-6 text-sm text-white/40">
              No destinations match this mood and season. Try adjusting your filters.
            </li>
          ) : (
            countries.map((country, index) => (
              <motion.li
                key={country.slug}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.04 + index * 0.04, ease }}
                className="flex items-center gap-1 border-b border-white/[0.06]"
              >
                <button
                  type="button"
                  onClick={() => onSelectCountry(country)}
                  className="group flex min-w-0 flex-1 items-center justify-between py-3 text-left"
                >
                  <span className="font-[family-name:var(--font-display)] text-lg text-white/85 transition group-hover:text-[#c5a059]">
                    {country.name}
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 text-[#c5a059]/35 transition group-hover:translate-x-0.5 group-hover:text-[#c5a059]"
                    strokeWidth={1.5}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => onToggleSave(country)}
                  aria-label={`Save ${country.name}`}
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center transition',
                    isSaved(country.slug) ? 'text-[#c5a059]' : 'text-white/25 hover:text-[#c5a059]',
                  )}
                >
                  <Heart
                    className="h-3.5 w-3.5"
                    strokeWidth={1.5}
                    fill={isSaved(country.slug) ? 'currentColor' : 'none'}
                  />
                </button>
              </motion.li>
            ))
          )}
        </ul>

        <div className="mt-auto pt-5">
          <Link
            href={`${prefix}/destinations/${dest.slugPath}`}
            className="group inline-flex w-full items-center justify-center gap-2 border border-[#c5a059]/40 px-4 py-3 text-[10px] font-semibold tracking-[0.2em] text-[#c5a059] uppercase transition hover:bg-[#c5a059] hover:text-[#0c0c0c]"
          >
            Explore {dest.name.split('&')[0].trim()}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function JourneyBoard({
  saved,
  max,
  prefix,
  onRemove,
  onSelect,
}: {
  saved: { slug: string; name: string; slugPath: string; blurb: string }[];
  max: number;
  prefix: string;
  onRemove: (slug: string) => void;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="border border-[#c5a059]/20 bg-white/[0.02] px-5 py-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.32em] text-[#c5a059] uppercase">
            Your Journey Board
          </p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-xl text-white">
            {saved.length === 0
              ? 'Save up to 3 places'
              : `${saved.length} of ${max} saved`}
          </p>
        </div>
        {saved.length > 0 ? (
          <Link
            href={`${prefix}/plan-your-journey`}
            className="text-[10px] font-semibold tracking-[0.16em] text-[#c5a059] uppercase transition hover:text-[#d4b56e]"
          >
            Plan →
          </Link>
        ) : null}
      </div>

      <div className="mt-4 space-y-2">
        {Array.from({ length: max }).map((_, i) => {
          const item = saved[i];
          if (!item) {
            return (
              <div
                key={`empty-${i}`}
                className="flex h-14 items-center border border-dashed border-white/10 px-4 text-[11px] tracking-[0.12em] text-white/25 uppercase"
              >
                Open slot
              </div>
            );
          }
          return (
            <div
              key={item.slug}
              className="group flex items-center gap-2 border border-[#c5a059]/25 bg-[#c5a059]/05 px-3 py-2.5"
            >
              <button
                type="button"
                onClick={() => onSelect(item.slug)}
                className="min-w-0 flex-1 text-left"
              >
                <span className="block font-[family-name:var(--font-display)] text-lg text-white transition group-hover:text-[#c5a059]">
                  {item.name}
                </span>
                <span className="block truncate text-[11px] text-white/40">{item.blurb}</span>
              </button>
              <button
                type="button"
                onClick={() => onRemove(item.slug)}
                aria-label={`Remove ${item.name}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center text-white/30 transition hover:text-[#c5a059]"
              >
                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          );
        })}
      </div>

      {saved.length > 0 ? (
        <p className="mt-3 text-[11px] leading-relaxed text-white/35">
          Saved places carry into Plan Your Journey automatically.
        </p>
      ) : (
        <p className="mt-3 text-[11px] leading-relaxed text-white/35">
          Tap the heart on any destination to build your board.
        </p>
      )}
    </div>
  );
}
