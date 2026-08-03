'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Building2,
  Mountain,
  Landmark,
  Trees,
  Anchor,
  Sun,
  Waves,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FadeIn, LazySection, RevealImage } from '@/components/motion/fade-in';
import { Button } from '@/components/ui/button';
import { EnquiryForm } from '@/components/forms/enquiry-form';
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
    <section className="relative bg-[var(--color-cream)] px-6 pb-10 pt-28 lg:px-8 lg:pt-32">
      <div className="mx-auto max-w-5xl text-center">
        <FadeIn direction="up" blur>
          <Link
            href={`/${locale}/itineraries`}
            className="mb-10 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[var(--color-ink)]/55 uppercase transition hover:text-[var(--color-gold)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to all journeys
          </Link>
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
        className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-[#c5a059]/20 bg-white p-7 shadow-[0_30px_80px_-36px_rgba(12,12,12,0.45)] md:p-10 lg:p-12"
        initial={reduce ? false : { opacity: 0, y: 40, filter: 'blur(8px)' }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Premium atmosphere */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(197,160,89,0.08),transparent_45%)]" />
        <div className="pointer-events-none absolute top-0 left-0 h-full w-[3px] bg-gradient-to-b from-[#c5a059] via-[#c5a059]/40 to-transparent" />

        <div className="relative flex flex-col gap-10 lg:flex-row lg:items-stretch lg:justify-between lg:gap-12">
          <div className="flex-1">
            <motion.p
              className="text-[11px] font-semibold tracking-[0.28em] text-[#c5a059] uppercase"
              initial={reduce ? false : { opacity: 0, x: -12 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              Journey at a glance
            </motion.p>

            {/* Connected timeline */}
            <div className="relative mt-8">
              {/* Animated connector line (desktop) */}
              <motion.div
                className="pointer-events-none absolute top-6 right-8 left-8 hidden h-px origin-left bg-gradient-to-r from-[#c5a059]/20 via-[#c5a059] to-[#c5a059]/20 md:block"
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={reduce ? undefined : { scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />

              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5 md:gap-3">
                {stops.map((stop, index) => {
                  const Icon = glanceIcons[stop.icon] ?? Building2;
                  return (
                    <motion.div
                      key={stop.label}
                      className="group relative text-center"
                      initial={
                        reduce
                          ? false
                          : { opacity: 0, y: 28, scale: 0.92 }
                      }
                      whileInView={
                        reduce
                          ? undefined
                          : { opacity: 1, y: 0, scale: 1 }
                      }
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.65,
                        delay: 0.2 + index * 0.1,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      whileHover={reduce ? undefined : { y: -6 }}
                    >
                      <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center">
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
                        <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#c5a059]/50 bg-[#f7f3eb] text-[#c5a059] shadow-[0_8px_24px_-12px_rgba(197,160,89,0.8)] transition-all duration-500 group-hover:border-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-[#0c0c0c]">
                          <Icon className="h-5 w-5" strokeWidth={1.25} />
                        </div>
                      </div>
                      <p className="font-[family-name:var(--font-display)] text-xl text-[#0c0c0c] transition-colors group-hover:text-[#c5a059] md:text-2xl">
                        {stop.label}
                      </p>
                      <p className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-[#0c0c0c]/45 uppercase">
                        {stop.detail}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Animated route map panel */}
          <motion.div
            className="relative hidden min-h-[180px] w-full max-w-[240px] shrink-0 overflow-hidden rounded-xl border border-[#c5a059]/20 bg-[#0c0c0c] lg:block"
            initial={reduce ? false : { opacity: 0, x: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.18),transparent_65%)]" />
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="relative flex h-full flex-col items-center justify-center p-6 text-center">
              <p className="font-[family-name:var(--font-display)] text-3xl text-white">
                {countryName}
              </p>
              <p className="mt-2 text-[10px] tracking-[0.22em] text-[#c5a059] uppercase">
                Route map
              </p>

              <div className="mt-6 flex w-full max-w-[160px] items-center justify-between px-1">
                {stops.map((s, i) => (
                  <span key={s.label} className="relative flex flex-1 items-center">
                    <motion.span
                      className="relative z-10 h-2.5 w-2.5 rounded-full bg-[#c5a059] shadow-[0_0_12px_rgba(197,160,89,0.8)]"
                      initial={reduce ? false : { scale: 0 }}
                      whileInView={reduce ? undefined : { scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 + i * 0.12, type: 'spring', stiffness: 260 }}
                    />
                    {i < stops.length - 1 ? (
                      <motion.span
                        className="absolute top-1/2 left-[50%] h-px w-full origin-left -translate-y-1/2 bg-gradient-to-r from-[#c5a059] to-[#c5a059]/30"
                        initial={reduce ? false : { scaleX: 0 }}
                        whileInView={reduce ? undefined : { scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.75 + i * 0.12,
                          duration: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    ) : null}
                  </span>
                ))}
              </div>

              <motion.p
                className="mt-5 text-[10px] tracking-[0.16em] text-white/40 uppercase"
                initial={reduce ? false : { opacity: 0 }}
                whileInView={reduce ? undefined : { opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2 }}
              >
                {stops.length} curated stops
              </motion.p>
            </div>
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
                  <p className="mt-5 text-base leading-[1.8] text-[var(--color-ink)]/70">
                    {place.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {place.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-3 text-sm text-[var(--color-ink)]"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold)]"
                          strokeWidth={2}
                        />
                        {h}
                      </li>
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

export function IncludedExtensions({
  included,
  extensions,
  image,
}: {
  included: string[];
  extensions: DemoItinerary['extensions'];
  image: string;
}) {
  return (
    <LazySection className="bg-[var(--color-cream)] px-6 py-16 lg:px-8">
      <FadeIn className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-[var(--color-ink)] text-white shadow-[0_30px_80px_-40px_rgba(12,12,12,0.6)]">
        <div className="grid lg:grid-cols-2">
          <div className="border-b border-white/10 p-8 md:p-10 lg:border-r lg:border-b-0">
            <div className="mb-6 flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-lg">
                <Image src={image} alt="" fill className="object-cover" sizes="56px" />
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
                What&apos;s included
              </h3>
            </div>
            <ul className="space-y-3">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/75">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-gold)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 md:p-10">
            <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl">
              Optional extensions
            </h3>
            <div className="mt-6 space-y-5">
              {extensions.map((ext) => (
                <div key={ext.title} className="flex gap-4">
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={ext.image}
                      alt={ext.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] tracking-[0.15em] text-[var(--color-gold)] uppercase">
                      {ext.nights}
                    </span>
                    <h4 className="mt-1.5 text-sm font-semibold tracking-wide uppercase">
                      {ext.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">
                      {ext.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </LazySection>
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
