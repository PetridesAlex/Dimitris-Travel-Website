'use client';

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FadeIn } from '@/components/motion/fade-in';
import { siteSettings } from '@/data/demo';
import { cn } from '@/lib/utils';

const RisingLines = dynamic(
  () => import('@/components/marketing/rising-lines').then((m) => m.RisingLines),
  { ssr: false },
);

const exploreLinks = [
  { href: '/destinations', label: 'Destinations' },
  { href: '/explore', label: 'Explore the Map' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/collections', label: 'Collections' },
  { href: '/itineraries', label: 'Itineraries' },
  { href: '/blog', label: 'Inspiration' },
] as const;

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/plan-your-journey', label: 'Plan Your Journey' },
] as const;

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center justify-between gap-3 border-b border-white/[0.06] py-2.5 text-[13px] tracking-[0.04em] text-white/55 transition-colors duration-300 hover:text-white"
      >
        <span className="relative">
          {label}
          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#c5a059] transition-all duration-500 group-hover:w-full" />
        </span>
        <ArrowUpRight
          className="h-3.5 w-3.5 shrink-0 text-white/0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#c5a059]"
          strokeWidth={1.5}
        />
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/60 transition duration-300 hover:border-[#c5a059]/50 hover:bg-[#c5a059]/10 hover:text-[#c5a059]"
    >
      {children}
    </a>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.5 8.5A1.75 1.75 0 1 1 6.5 5a1.75 1.75 0 0 1 0 3.5zM5 10h3v9H5v-9zm5 0h2.9v1.2h.1c.4-.8 1.4-1.4 2.8-1.4 3 0 3.5 2 3.5 4.5V19h-3v-4c0-1 0-2.2-1.4-2.2s-1.6 1.1-1.6 2.1V19h-3v-9z" />
    </svg>
  );
}

export function Footer({ locale = 'en' }: { locale?: string }) {
  const prefix = `/${locale}`;
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-[#0c0c0c] text-white">
      {!reduce ? (
        <RisingLines
          className="z-0 opacity-80"
          color="#c5a059"
          horizonColor="#c5a059"
          haloColor="#e0c57a"
          riseSpeed={0.07}
          riseScale={12}
          riseIntensity={0.5}
          flowSpeed={0.16}
          flowDensity={3}
          flowIntensity={0.32}
          horizonIntensity={0.5}
          haloIntensity={3.8}
          horizonHeight={-0.5}
          circleScale={0.28}
          scale={3.4}
          brightness={0.8}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_10%_0%,rgba(197,160,89,0.08),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/55 to-[#0c0c0c]/25" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-[#c5a059]/45 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-10 lg:px-8 lg:pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.35fr_1fr_1fr_1.15fr] lg:gap-12">
          <FadeIn direction="up" distance={28} blur>
            <Link href={prefix} className="inline-flex flex-col leading-none">
              <span className="font-[family-name:var(--font-display)] text-2xl tracking-[0.22em] uppercase">
                Uncharted
              </span>
              <span className="font-[family-name:var(--font-script)] text-2xl text-[#c5a059]">
                Journeys
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              Tailor-made luxury journeys designed around you — cinematic, personal,
              and effortless.
            </p>

            <div className="mt-8 flex gap-3">
              <SocialLink href={siteSettings.socials.instagram} label="Instagram">
                <InstagramIcon className="h-4 w-4" />
              </SocialLink>
              <SocialLink href={siteSettings.socials.facebook} label="Facebook">
                <FacebookIcon className="h-4 w-4" />
              </SocialLink>
              <SocialLink href={siteSettings.socials.linkedin} label="LinkedIn">
                <LinkedInIcon className="h-4 w-4" />
              </SocialLink>
            </div>
          </FadeIn>

          <FadeIn direction="up" distance={28} delay={0.08}>
            <h4 className="mb-1 text-[10px] font-semibold tracking-[0.32em] text-[#c5a059] uppercase">
              Explore
            </h4>
            <motion.div
              aria-hidden
              className="mb-5 h-px w-10 origin-left bg-[#c5a059]/60"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            />
            <ul>
              {exploreLinks.map((link) => (
                <FooterLink
                  key={link.href}
                  href={`${prefix}${link.href}`}
                  label={link.label}
                />
              ))}
            </ul>
          </FadeIn>

          <FadeIn direction="up" distance={28} delay={0.14}>
            <h4 className="mb-1 text-[10px] font-semibold tracking-[0.32em] text-[#c5a059] uppercase">
              Company
            </h4>
            <motion.div
              aria-hidden
              className="mb-5 h-px w-10 origin-left bg-[#c5a059]/60"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
            <ul>
              {companyLinks.map((link) => (
                <FooterLink
                  key={link.href}
                  href={`${prefix}${link.href}`}
                  label={link.label}
                />
              ))}
            </ul>
          </FadeIn>

          <FadeIn direction="up" distance={28} delay={0.2}>
            <h4 className="mb-1 text-[10px] font-semibold tracking-[0.32em] text-[#c5a059] uppercase">
              Contact
            </h4>
            <motion.div
              aria-hidden
              className="mb-5 h-px w-10 origin-left bg-[#c5a059]/60"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            />
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${siteSettings.phone.replace(/\s/g, '')}`}
                  className="group flex items-start gap-3 text-sm text-white/55 transition hover:text-white"
                >
                  <Phone
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a059]/70 transition group-hover:text-[#c5a059]"
                    strokeWidth={1.4}
                  />
                  <span>{siteSettings.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="group flex items-start gap-3 text-sm text-white/55 transition hover:text-white"
                >
                  <Mail
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a059]/70 transition group-hover:text-[#c5a059]"
                    strokeWidth={1.4}
                  />
                  <span className="break-all">{siteSettings.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-white/55">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a059]/70"
                  strokeWidth={1.4}
                />
                <span>{siteSettings.address}</span>
              </li>
            </ul>

            <Link
              href={`${prefix}/plan-your-journey`}
              className={cn(
                'mt-8 inline-flex items-center gap-2 border border-[#c5a059]/50 bg-[#c5a059]/10 px-5 py-3',
                'text-[11px] font-semibold tracking-[0.2em] text-[#c5a059] uppercase',
                'transition duration-300 hover:border-[#c5a059] hover:bg-[#c5a059] hover:text-[#0c0c0c]',
              )}
            >
              Plan Your Journey
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </FadeIn>
        </div>

        <FadeIn delay={0.25} className="mt-14 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-[11px] tracking-[0.12em] text-white/35 uppercase sm:flex-row">
            <p>© {year} Uncharted Journeys. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href={`${prefix}/privacy`} className="transition hover:text-[#c5a059]">
                Privacy
              </Link>
              <Link href={`${prefix}/terms`} className="transition hover:text-[#c5a059]">
                Terms
              </Link>
              <span className="hidden text-[#c5a059]/40 sm:inline">·</span>
              <span className="normal-case tracking-normal text-white/25">
                Crafted for the journey ahead
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
