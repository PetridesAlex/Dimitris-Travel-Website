'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { FadeIn, RevealImage, Stagger } from '@/components/motion/fade-in';
import { cn, formatCurrency } from '@/lib/utils';

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  align = 'center',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
  align?: 'center' | 'left';
}) {
  return (
    <FadeIn
      className={`mb-12 ${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-left'}`}
      direction="up"
      distance={32}
      blur
      duration={0.85}
    >
      {eyebrow ? (
        <p className="mb-3 text-xs tracking-[0.25em] text-[var(--color-gold)] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`font-[family-name:var(--font-display)] text-4xl md:text-5xl ${
          light ? 'text-white' : 'text-[var(--color-ink)]'
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base leading-relaxed ${
            light ? 'text-white/70' : 'text-[var(--color-muted)]'
          }`}
        >
          {description}
        </p>
      ) : null}
    </FadeIn>
  );
}

export function ExperienceCard({
  href,
  name,
  tagline,
  image,
}: {
  href: string;
  name: string;
  tagline: string;
  image: string;
}) {
  return (
    <FadeIn direction="up" distance={40} blur duration={0.85}>
      <Link href={href} className="group block overflow-hidden rounded-xl">
        <RevealImage className="relative aspect-[4/3]">
          <Image
            src={image}
            alt={name}
            fill
            loading="lazy"
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 p-5">
            <h3 className="font-[family-name:var(--font-display)] text-2xl text-white">
              {name}
            </h3>
            <p className="mt-1 text-sm text-white/70">{tagline}</p>
          </div>
        </RevealImage>
      </Link>
    </FadeIn>
  );
}

export function HotelCard({
  href,
  name,
  locationLabel,
  image,
  starRating,
}: {
  href: string;
  name: string;
  locationLabel: string;
  image: string;
  starRating: number;
}) {
  return (
    <FadeIn direction="up" distance={40} blur duration={0.85}>
      <Link href={href} className="group block">
        <RevealImage className="relative mb-4 aspect-[4/3] rounded-xl">
          <Image
            src={image}
            alt={name}
            fill
            loading="lazy"
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        </RevealImage>
        <p className="text-xs tracking-widest text-[var(--color-gold)] uppercase">
          {starRating}★ Luxury
        </p>
        <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-white">
          {name}
        </h3>
        <p className="text-sm text-white/60">{locationLabel}</p>
      </Link>
    </FadeIn>
  );
}

export function ItineraryCard({
  href,
  title,
  citiesLabel,
  durationDays,
  priceFrom,
  currency,
  image,
  summary,
}: {
  href: string;
  title: string;
  citiesLabel: string;
  durationDays: number;
  priceFrom: number;
  currency: string;
  image: string;
  summary: string;
}) {
  return (
    <FadeIn
      className="group relative min-h-[420px] overflow-hidden rounded-xl"
      direction="up"
      distance={44}
      blur
      duration={0.9}
    >
      <Link href={href} className="absolute inset-0">
        <Image
          src={image}
          alt={title}
          fill
          loading="lazy"
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-semibold tracking-wider text-[var(--color-ink)] uppercase">
          {durationDays} Days
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="font-[family-name:var(--font-display)] text-3xl text-white">
            {title}
          </h3>
          <p className="mt-2 text-sm text-white/70">{citiesLabel}</p>
          <p className="mt-3 line-clamp-2 text-sm text-white/60">{summary}</p>
          <p className="mt-4 text-sm text-[var(--color-gold)]">
            From {formatCurrency(priceFrom, currency)} / per person
          </p>
        </div>
      </Link>
    </FadeIn>
  );
}

export function BlogCard({
  href,
  title,
  excerpt,
  image,
  category,
  date,
}: {
  href: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
}) {
  return (
    <FadeIn direction="up" distance={40} blur duration={0.85}>
      <Link href={href} className="group block">
        <RevealImage className="relative mb-4 aspect-[16/10] rounded-xl">
          <Image
            src={image}
            alt={title}
            fill
            loading="lazy"
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        </RevealImage>
        <p className="text-xs tracking-widest text-[var(--color-gold)] uppercase">
          {category} · {date}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white group-hover:text-[var(--color-gold)]">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/60">{excerpt}</p>
      </Link>
    </FadeIn>
  );
}

export function CtaBand({
  title,
  locale = 'en',
}: {
  title: string;
  locale?: string;
}) {
  return (
    <section className="border-t border-black/5 bg-[var(--color-cream)]">
      <FadeIn
        className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center lg:px-8"
        direction="up"
        distance={28}
        blur
      >
        <div className="flex items-start gap-4">
          <div className="mt-1 h-10 w-10 rounded-full border border-[var(--color-gold)]/40 text-center leading-10 text-[var(--color-gold)]">
            ✦
          </div>
          <p className="max-w-xl font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] md:text-3xl">
            {title}
          </p>
        </div>
        <Link
          href={`/${locale}/plan-your-journey`}
          className="inline-flex h-11 items-center bg-[var(--color-gold)] px-6 text-sm font-medium tracking-wide text-[var(--color-ink)] uppercase transition hover:bg-[var(--color-gold-light)]"
        >
          Plan Your Journey
        </Link>
      </FadeIn>
    </section>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="relative bg-[#0c0c0c]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/25 to-transparent" />
      <FadeIn
        className="mx-auto max-w-7xl px-6 py-5 lg:px-8"
        direction="none"
        duration={0.55}
      >
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;

            return (
              <li key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-1">
                {i > 0 ? (
                  <ChevronRight
                    className="mx-1 h-3 w-3 shrink-0 text-[#c5a059]/45"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                ) : null}

                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'group relative text-[10px] font-semibold tracking-[0.22em] text-white/45 uppercase',
                      'transition-colors duration-300 hover:text-[#c5a059]',
                    )}
                  >
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#c5a059] transition-all duration-500 group-hover:w-full" />
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={cn(
                      'min-w-0 truncate text-[10px] font-medium tracking-[0.14em]',
                      isLast
                        ? 'max-w-[min(100%,28rem)] text-[#c5a059]/90 normal-case tracking-[0.04em] md:tracking-[0.06em]'
                        : 'text-white/45 uppercase',
                    )}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </FadeIn>
    </nav>
  );
}

export function DestinationSubnav({
  items,
}: {
  items: { id: string; label: string; icon?: ReactNode }[];
}) {
  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-[var(--color-ink)]/95 backdrop-blur">
      <Stagger
        className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-6 py-4 lg:px-8"
        stagger={0.05}
        direction="up"
      >
        {items.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`shrink-0 border-b-2 pb-1 text-xs tracking-[0.18em] uppercase transition ${
              index === 0
                ? 'border-[var(--color-gold)] text-[var(--color-gold)]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            {item.label}
          </a>
        ))}
      </Stagger>
    </div>
  );
}

export function FactsGrid({
  facts,
  dark = false,
}: {
  facts: { label: string; value: string }[];
  dark?: boolean;
}) {
  return (
    <Stagger className="mt-8 grid gap-4 sm:grid-cols-2" stagger={0.08} direction="up">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className={`border-l-2 border-[var(--color-gold)] pl-4 ${
            dark ? 'text-white' : 'text-[var(--color-ink)]'
          }`}
        >
          <p className="text-xs tracking-widest text-[var(--color-gold)] uppercase">
            {fact.label}
          </p>
          <p
            className={`mt-1 text-sm ${dark ? 'text-white/80' : 'text-[var(--color-muted)]'}`}
          >
            {fact.value}
          </p>
        </div>
      ))}
    </Stagger>
  );
}
