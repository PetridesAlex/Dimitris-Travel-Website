'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Plane,
  CalendarDays,
  ScrollText,
  Map,
  ChevronDown,
  Building2,
  Mountain,
  Landmark,
  Trees,
  Anchor,
  Sun,
  Waves,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FadeIn, LazySection, RevealImage } from '@/components/motion/fade-in';
import { Button } from '@/components/ui/button';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { JourneyCountryMap } from '@/components/itinerary/journey-country-map';
import type {
  DemoItinerary,
  DemoItineraryGlanceStop,
  DemoItineraryPlace,
} from '@/data/demo';
import { cn } from '@/lib/utils';

const glanceIcons = {
  city: Building2,
  mountain: Mountain,
  temple: Landmark,
  nature: Trees,
  port: Anchor,
  desert: Sun,
  coast: Waves,
} as const;

export function ItineraryHero({
  itinerary,
  locale,
}: {
  itinerary: DemoItinerary;
  locale: string;
}) {
  return (
    <section className="relative z-10 bg-[var(--color-cream)] px-6 pb-10 pt-28 lg:px-8 lg:pt-32">
      <div className="mx-auto max-w-5xl text-center">
        <Link
          href={`/${locale}/itineraries`}
          className="group relative z-20 mb-10 inline-flex items-center gap-3 border border-[#c5a059]/60 bg-[#f7f3eb] px-5 py-2.5 text-[13px] font-semibold tracking-[0.2em] text-[#0c0c0c] uppercase shadow-[0_10px_30px_-18px_rgba(12,12,12,0.35)] transition duration-300 hover:border-[#c5a059] hover:bg-[#c5a059] hover:text-[#0c0c0c]"
        >
          <ArrowLeft
            className="h-4 w-4 shrink-0 text-[#c5a059] transition duration-300 group-hover:text-[#0c0c0c]"
            strokeWidth={2}
            aria-hidden
          />
          <span className="text-[#0c0c0c] transition duration-300 group-hover:text-[#0c0c0c]">
            Back to all journeys
          </span>
        </Link>

        <FadeIn direction="up" blur>
          <h1 className="font-[family-name:var(--font-display)] text-4xl leading-[1.1] text-[var(--color-ink)] md:text-6xl lg:text-7xl">
            {itinerary.title}
          </h1>
          <p className="mt-5 text-[11px] font-semibold tracking-[0.28em] text-[var(--color-gold)] uppercase">
            {itinerary.durationDays}-day signature journey · {itinerary.countryName}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-ink)]/70 md:text-lg">
            {itinerary.summary}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

export function JourneyAtAGlance({
  stops,
  countryName,
}: {
  stops: DemoItineraryGlanceStop[];
  countryName: string;
}) {
  const reduce = useReducedMotion();

  return (
    <LazySection className="bg-[var(--color-cream)] px-6 pb-16 lg:px-8">
      <motion.div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#c5a059]/20 bg-white p-8 shadow-[0_30px_80px_-36px_rgba(12,12,12,0.45)] md:p-12 lg:p-14"
        initial={reduce ? false : { opacity: 0, y: 40, filter: 'blur(8px)' }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(197,160,89,0.08),transparent_45%)]" />
        <div className="pointer-events-none absolute top-0 left-0 h-full w-[3px] bg-gradient-to-b from-[#c5a059] via-[#c5a059]/40 to-transparent" />

        <div className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <motion.p
              className="text-[11px] font-semibold tracking-[0.28em] text-[#c5a059] uppercase"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              Journey at a glance
            </motion.p>
            <motion.h2
              className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[#0c0c0c] md:text-4xl"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.22, duration: 0.6 }}
            >
              {stops.length} curated stops across {countryName}
            </motion.h2>
          </div>

          <div className="relative mt-10 md:mt-12">
            <motion.div
              className="pointer-events-none absolute top-8 right-[8%] left-[8%] hidden h-px origin-left bg-gradient-to-r from-[#c5a059]/20 via-[#c5a059] to-[#c5a059]/20 md:block"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={reduce ? undefined : { scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />

            <div
              className={cn(
                'grid gap-8',
                stops.length <= 3
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : stops.length === 4
                    ? 'grid-cols-2 md:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
              )}
            >
              {stops.map((stop, index) => {
                const Icon = glanceIcons[stop.icon] ?? Building2;
                return (
                  <motion.div
                    key={stop.label}
                    className="group relative text-center"
                    initial={
                      reduce ? false : { opacity: 0, y: 28, scale: 0.92 }
                    }
                    whileInView={
                      reduce ? undefined : { opacity: 1, y: 0, scale: 1 }
                    }
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.65,
                      delay: 0.2 + index * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={reduce ? undefined : { y: -6 }}
                  >
                    <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
                      <motion.span
                        className="absolute inset-0 rounded-full border border-[#c5a059]/30"
                        animate={
                          reduce
                            ? undefined
                            : {
                                scale: [1, 1.12, 1],
                                opacity: [0.5, 0.15, 0.5],
                              }
                        }
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          delay: index * 0.25,
                          ease: 'easeInOut',
                        }}
                      />
                      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-[#c5a059]/50 bg-[#f7f3eb] text-[#c5a059] shadow-[0_8px_24px_-12px_rgba(197,160,89,0.8)] transition-all duration-500 group-hover:border-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-[#0c0c0c]">
                        <Icon className="h-6 w-6" strokeWidth={1.25} />
                      </div>
                    </div>
                    <p className="font-[family-name:var(--font-display)] text-2xl text-[#0c0c0c] transition-colors group-hover:text-[#c5a059] md:text-3xl">
                      {stop.label}
                    </p>
                    <p className="mt-2 text-[11px] font-semibold tracking-[0.2em] text-[#0c0c0c]/50 uppercase">
                      {stop.detail}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            className="mt-10 w-full min-w-0 md:mt-14"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <JourneyCountryMap
              countryName={countryName}
              stopLabels={stops.map((s) => s.label)}
              className="w-full min-w-0"
            />
          </motion.div>
        </div>
      </motion.div>
    </LazySection>
  );
}

export function ItineraryPlaces({
  label,
  places,
}: {
  label: string;
  places: DemoItineraryPlace[];
}) {
  return (
    <LazySection className="bg-[var(--color-cream)] px-6 py-8 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mb-14 text-center" blur>
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[var(--color-gold)] uppercase">
            The journey
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)] md:text-5xl">
            {label}
          </h2>
        </FadeIn>

        <div className="space-y-20 md:space-y-28">
          {places.map((place, index) => {
            const imageLeft = index % 2 === 1;
            return (
              <div
                key={place.number}
                className={cn(
                  'grid items-center gap-10 lg:grid-cols-2 lg:gap-16',
                )}
              >
                <FadeIn
                  className={cn(imageLeft && 'lg:order-2')}
                  direction={imageLeft ? 'right' : 'left'}
                  distance={40}
                  blur
                >
                  <p className="font-[family-name:var(--font-display)] text-5xl text-[var(--color-gold)] md:text-6xl">
                    {place.number}
                  </p>
                  <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)] md:text-4xl">
                    {place.title}
                  </h3>
                  {place.subtitle ? (
                    <p className="mt-2 text-xs tracking-[0.2em] text-[var(--color-gold)] uppercase">
                      {place.subtitle}
                    </p>
                  ) : null}
                  <p className="mt-5 text-base leading-[1.8] text-[var(--color-ink)]/70 md:text-lg">
                    {place.description}
                  </p>
                  <ul className="mt-8 space-y-0">
                    {place.highlights.map((h, hi) => (
                      <motion.li
                        key={h}
                        className="group flex items-start gap-4 border-b border-[#0c0c0c]/08 py-3.5 last:border-b-0"
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.12 + hi * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#c5a059]/45 bg-[#c5a059]/10 text-[#c5a059] transition duration-300 group-hover:border-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-[#0c0c0c]">
                          <Check className="h-3.5 w-3.5" strokeWidth={2.25} />
                        </span>
                        <span className="pt-0.5 font-[family-name:var(--font-display)] text-[17px] leading-snug font-medium tracking-[0.01em] text-[#0c0c0c] transition-colors duration-300 group-hover:text-[#c5a059] md:text-[18px]">
                          {h}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </FadeIn>

                <RevealImage
                  className={cn(
                    'relative aspect-[16/10] overflow-hidden rounded-xl md:rounded-2xl',
                    imageLeft && 'lg:order-1',
                  )}
                >
                  <Image
                    src={place.image}
                    alt={place.title}
                    fill
                    loading="lazy"
                    className="object-cover transition duration-700 hover:scale-105"
                    sizes="(max-width:1024px) 100vw, 50vw"
                  />
                </RevealImage>
              </div>
            );
          })}
        </div>
      </div>
    </LazySection>
  );
}

export function ItineraryPackageDetails({
  itinerary,
  locale,
}: {
  itinerary: DemoItinerary;
  locale: string;
}) {
  const reduce = useReducedMotion();
  const nav = useMemo(
    () =>
      (
        [
          itinerary.days.length ? { id: 'program', label: 'Program', icon: Map } : null,
          itinerary.flights.length ? { id: 'flights', label: 'Flights', icon: Plane } : null,
          itinerary.departureDates.length
            ? { id: 'departures', label: 'Departures', icon: CalendarDays }
            : null,
          itinerary.included.length || itinerary.excluded.length
            ? { id: 'included', label: 'Included', icon: Check }
            : null,
          itinerary.excluded.length ? { id: 'excluded', label: 'Excluded', icon: X } : null,
          itinerary.terms.length ? { id: 'terms', label: 'Terms', icon: ScrollText } : null,
        ] as const
      ).filter(Boolean) as { id: string; label: string; icon: typeof Map }[],
    [itinerary],
  );

  const [activeId, setActiveId] = useState(nav[0]?.id ?? '');
  const [openDays, setOpenDays] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    itinerary.days.slice(0, 3).forEach((d) => initial.add(d.day));
    return initial;
  });

  useEffect(() => {
    if (!nav.length) return;
    const sections = nav
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.15, 0.35, 0.55] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [nav]);

  const toggleDay = (day: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const expandAllDays = () => {
    setOpenDays(new Set(itinerary.days.map((d) => d.day)));
  };

  const collapseAllDays = () => {
    setOpenDays(new Set());
  };

  if (nav.length === 0 && itinerary.extensions.length === 0) return null;

  const priceLabel = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: itinerary.currency || 'EUR',
    maximumFractionDigits: 0,
  }).format(itinerary.priceFrom);

  return (
    <LazySection className="relative overflow-hidden bg-[var(--color-cream)] px-6 py-16 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.08),transparent_45%)]" />
      <div className="relative mx-auto max-w-6xl">
        <FadeIn className="mb-10 md:mb-12" blur>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em] text-[var(--color-gold)] uppercase">
                Journey details
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl leading-tight text-[var(--color-ink)] md:text-5xl">
                Everything you need to know
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-ink)]/65">
                Program, flights, departure windows, and the fine print — designed so planning feels
                effortless.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-px overflow-hidden border border-[#c5a059] bg-[#c5a059]">
              {[
                { label: 'Duration', value: `${itinerary.durationDays} days` },
                { label: 'From', value: priceLabel },
                {
                  label: 'Stops',
                  value: String(itinerary.glanceStops?.length || itinerary.places?.length || '—'),
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#0c0c0c] px-3 py-5 text-center sm:px-4 sm:py-6"
                >
                  <p className="text-[11px] font-bold tracking-[0.28em] text-[#c5a059] uppercase">
                    {stat.label}
                  </p>
                  <p className="mt-2.5 font-[family-name:var(--font-display)] text-2xl font-semibold leading-none tracking-wide text-white sm:text-3xl">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {nav.length > 0 ? (
          <div className="sticky top-[4.5rem] z-30 mb-12 border-y border-[#c5a059]/25 bg-[var(--color-cream)]/95 backdrop-blur-md md:top-20">
            <nav
              aria-label="Package sections"
              className="flex gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {nav.map((item) => {
                const Icon = item.icon;
                const active = activeId === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setActiveId(item.id)}
                    className={cn(
                      'group relative flex shrink-0 items-center gap-2 px-4 py-4 text-[11px] font-semibold tracking-[0.18em] uppercase transition sm:px-5',
                      active ? 'text-[#0c0c0c]' : 'text-[#0c0c0c]/45 hover:text-[#0c0c0c]',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-3.5 w-3.5 transition',
                        active ? 'text-[#c5a059]' : 'text-[#0c0c0c]/30 group-hover:text-[#c5a059]',
                      )}
                      strokeWidth={1.75}
                    />
                    {item.label}
                    <span
                      className={cn(
                        'absolute inset-x-3 bottom-0 h-[2px] origin-left bg-[#c5a059] transition duration-300',
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </a>
                );
              })}
            </nav>
          </div>
        ) : null}

        <div className="space-y-10 md:space-y-12">
          {itinerary.days.length > 0 ? (
            <PackagePanel
              id="program"
              eyebrow="Program"
              title="Day-by-day journey"
              subtitle={`${itinerary.days.length} carefully paced days`}
              icon={Map}
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#0c0c0c]/08 pb-4">
                <p className="text-sm text-[#0c0c0c]/55">
                  Expand any day for the full outline.
                </p>
                <div className="flex gap-4 text-[11px] font-semibold tracking-[0.16em] uppercase">
                  <button
                    type="button"
                    onClick={expandAllDays}
                    className="text-[#c5a059] transition hover:text-[#0c0c0c]"
                  >
                    Expand all
                  </button>
                  <button
                    type="button"
                    onClick={collapseAllDays}
                    className="text-[#0c0c0c]/45 transition hover:text-[#0c0c0c]"
                  >
                    Collapse
                  </button>
                </div>
              </div>

              <ol className="space-y-2">
                {itinerary.days.map((day, index) => {
                  const open = openDays.has(day.day);
                  return (
                    <motion.li
                      key={`${day.day}-${day.title}`}
                      initial={reduce ? false : { opacity: 0, y: 16 }}
                      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.3) }}
                      className="border border-[#0c0c0c]/08 bg-[#f7f3eb]/40 transition hover:border-[#c5a059]/40"
                    >
                      <button
                        type="button"
                        onClick={() => toggleDay(day.day)}
                        aria-expanded={open}
                        className="flex w-full items-start gap-4 px-4 py-4 text-left sm:gap-5 sm:px-5 sm:py-5"
                      >
                        <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center border border-[#c5a059]/45 bg-white">
                          <span className="text-[9px] tracking-[0.16em] text-[#c5a059] uppercase">
                            Day
                          </span>
                          <span className="font-[family-name:var(--font-display)] text-lg leading-none text-[#0c0c0c]">
                            {String(day.day).padStart(2, '0')}
                          </span>
                        </span>
                        <span className="min-w-0 flex-1 pt-0.5">
                          <span className="block font-[family-name:var(--font-display)] text-xl text-[#0c0c0c] sm:text-2xl">
                            {day.title}
                          </span>
                          {!open ? (
                            <span className="mt-1 line-clamp-1 block text-sm text-[#0c0c0c]/50">
                              {day.body}
                            </span>
                          ) : null}
                        </span>
                        <motion.span
                          animate={{ rotate: open ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="mt-2 text-[#c5a059]"
                        >
                          <ChevronDown className="h-5 w-5" />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {open ? (
                          <motion.div
                            key="body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="border-t border-[#0c0c0c]/06 px-4 pb-5 text-[15px] leading-relaxed text-[#0c0c0c]/70 sm:px-5 sm:pl-[4.75rem]">
                              {day.body}
                            </p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.li>
                  );
                })}
              </ol>
            </PackagePanel>
          ) : null}

          {itinerary.flights.length > 0 ? (
            <PackagePanel
              id="flights"
              eyebrow="Flights"
              title="Getting there"
              subtitle="Airports, transfers, and how the journey connects"
              icon={Plane}
            >
              <div className="relative">
                <div className="pointer-events-none absolute top-0 bottom-0 left-[19px] w-px bg-gradient-to-b from-[#c5a059] via-[#c5a059]/40 to-transparent sm:left-[23px]" />
                <ul className="space-y-4">
                  {itinerary.flights.map((item, index) => (
                    <motion.li
                      key={item}
                      initial={reduce ? false : { opacity: 0, x: -12 }}
                      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.08, duration: 0.45 }}
                      className="relative flex gap-4 sm:gap-5"
                    >
                      <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center border-2 border-[#c5a059] bg-[#0c0c0c] font-[family-name:var(--font-display)] text-base font-semibold text-[#c5a059] sm:h-12 sm:w-12 sm:text-lg">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 border border-[#0c0c0c]/10 bg-white px-4 py-4 sm:px-5 sm:py-5">
                        <p className="text-base font-medium leading-relaxed text-[#0c0c0c] sm:text-[17px]">
                          {item}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </PackagePanel>
          ) : null}

          {itinerary.departureDates.length > 0 ? (
            <PackagePanel
              id="departures"
              eyebrow="Departures"
              title="When you can travel"
              subtitle="Private departures with seasonal guidance"
              icon={CalendarDays}
            >
              <ul className="grid gap-3 sm:grid-cols-2">
                {itinerary.departureDates.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07, duration: 0.45 }}
                    whileHover={reduce ? undefined : { y: -3 }}
                    className="group relative overflow-hidden border border-[#c5a059]/30 bg-white px-5 py-5"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#c5a059]/0 via-transparent to-[#c5a059]/10 opacity-0 transition group-hover:opacity-100" />
                    <div className="relative flex items-start gap-3">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a059]" />
                      <p className="text-sm leading-relaxed text-[#0c0c0c]/75">{item}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </PackagePanel>
          ) : null}

          {itinerary.included.length > 0 || itinerary.excluded.length > 0 ? (
            <div className="scroll-mt-32 grid overflow-hidden border border-[#c5a059]/25 lg:grid-cols-2">
              <div id="included" className="scroll-mt-32 bg-[var(--color-ink)] p-7 text-white md:p-9">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center border border-[#c5a059]/50 text-[#c5a059]">
                    <Check className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.22em] text-[#c5a059] uppercase">
                      Included
                    </p>
                    <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
                      What&apos;s included
                    </h3>
                  </div>
                </div>
                <ul className="space-y-0">
                  {itinerary.included.map((item, index) => (
                    <motion.li
                      key={item}
                      initial={reduce ? false : { opacity: 0, x: -10 }}
                      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 border-b border-white/10 py-3.5 text-sm leading-relaxed text-white/75 last:border-0"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a059]" strokeWidth={2} />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div id="excluded" className="scroll-mt-32 bg-[#f7f3eb] p-7 md:p-9">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center border border-[#0c0c0c]/15 text-[#0c0c0c]/50">
                    <X className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.22em] text-[#0c0c0c]/40 uppercase">
                      Excluded
                    </p>
                    <h3 className="font-[family-name:var(--font-display)] text-2xl text-[#0c0c0c] md:text-3xl">
                      What&apos;s excluded
                    </h3>
                  </div>
                </div>
                <ul className="space-y-0">
                  {itinerary.excluded.map((item, index) => (
                    <motion.li
                      key={item}
                      initial={reduce ? false : { opacity: 0, x: 10 }}
                      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3 border-b border-[#0c0c0c]/08 py-3.5 text-sm leading-relaxed text-[#0c0c0c]/60 last:border-0"
                    >
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-[#0c0c0c]/30" strokeWidth={2} />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          {itinerary.terms.length > 0 ? (
            <PackagePanel
              id="terms"
              eyebrow="Terms"
              title="Terms & conditions"
              subtitle="Key points before you book"
              icon={ScrollText}
            >
              <ol className="space-y-3">
                {itinerary.terms.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 border-b border-[#0c0c0c]/08 pb-3.5 last:border-0"
                  >
                    <span className="font-[family-name:var(--font-display)] text-lg text-[#c5a059]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="pt-0.5 text-sm leading-relaxed text-[#0c0c0c]/75">{item}</p>
                  </motion.li>
                ))}
              </ol>
              <Link
                href={`/${locale}/terms`}
                className="mt-7 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.18em] text-[#c5a059] uppercase transition hover:text-[#0c0c0c]"
              >
                Read full terms
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </PackagePanel>
          ) : null}

          {itinerary.extensions.length > 0 ? (
            <div className="overflow-hidden bg-[var(--color-ink)] text-white">
              <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-[260px] lg:min-h-full">
                  <Image
                    src={itinerary.image}
                    alt=""
                    fill
                    className="object-cover opacity-80"
                    sizes="(max-width:1024px) 100vw, 40vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/45 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                    <p className="text-[11px] font-semibold tracking-[0.24em] text-[#c5a059] uppercase">
                      Go further
                    </p>
                    <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl md:text-4xl">
                      Optional extensions
                    </h3>
                  </div>
                </div>
                <div className="space-y-0 p-2 md:p-3">
                  {itinerary.extensions.map((ext, index) => (
                    <motion.div
                      key={ext.title}
                      initial={reduce ? false : { opacity: 0, y: 16 }}
                      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group flex gap-4 border-b border-white/10 p-5 last:border-0 sm:p-6"
                    >
                      <div className="relative h-24 w-28 shrink-0 overflow-hidden">
                        <Image
                          src={ext.image}
                          alt={ext.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-105"
                          sizes="112px"
                        />
                      </div>
                      <div>
                        <span className="inline-block border border-[#c5a059]/40 px-2.5 py-0.5 text-[10px] tracking-[0.15em] text-[#c5a059] uppercase">
                          {ext.nights}
                        </span>
                        <h4 className="mt-2 font-[family-name:var(--font-display)] text-xl">
                          {ext.title}
                        </h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                          {ext.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </LazySection>
  );
}

function PackagePanel({
  id,
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  icon: typeof Plane;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      id={id}
      className="scroll-mt-32 border border-[#c5a059]/20 bg-white/80 p-6 backdrop-blur-sm md:p-9"
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-7 flex items-start gap-4 border-b border-[#0c0c0c]/08 pb-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-[#c5a059] bg-[#0c0c0c] text-[#c5a059]">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[12px] font-bold tracking-[0.28em] text-[#c5a059] uppercase">
            {eyebrow}
          </p>
          <h3 className="mt-1.5 font-[family-name:var(--font-display)] text-3xl font-semibold text-[#0c0c0c] md:text-4xl">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-2 text-sm font-medium text-[#0c0c0c]/60">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {children}
    </motion.section>
  );
}

export function ItineraryEnquiry({
  locale,
  title,
  countryName,
}: {
  locale: string;
  title: string;
  countryName: string;
}) {
  return (
    <LazySection
      id="enquire"
      className="bg-[var(--color-cream)] px-6 py-20 lg:px-8"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <FadeIn direction="left" blur>
          <p className="text-[11px] font-semibold tracking-[0.25em] text-[var(--color-gold)] uppercase">
            Start planning
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)] md:text-5xl">
            Plan your journey with us
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-ink)]/70">
            Tell us how you&apos;d like to travel — we&apos;ll tailor{' '}
            <span className="font-medium text-[var(--color-ink)]">{title}</span> in{' '}
            {countryName} around your dates, pace, and preferences.
          </p>
          <Button asChild className="mt-8" size="lg">
            <a href="#enquire-form">Reach out to start planning</a>
          </Button>
        </FadeIn>
        <div id="enquire-form" className="rounded-2xl bg-[var(--color-ink)] p-2">
          <EnquiryForm locale={locale} defaultDestination={`${title} · ${countryName}`} />
        </div>
      </div>
    </LazySection>
  );
}
