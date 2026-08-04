'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FadeIn, ParallaxHeroMedia, TextReveal } from '@/components/motion/fade-in';
import { resolveDestinationImage } from '@/lib/destination-images';
import { cn } from '@/lib/utils';

type HeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  imageAlt?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  scriptEyebrow?: boolean;
  tall?: boolean;
};

function HeroPrimaryCta({ label, href }: { label: string; href: string }) {
  const reduce = useReducedMotion();

  return (
    <Link
      href={href}
      className={cn(
        'group relative inline-flex h-12 min-w-[220px] items-center justify-center overflow-hidden px-8',
        'text-[12px] font-semibold tracking-[0.2em] text-[#0c0c0c] uppercase',
        'shadow-[0_16px_40px_-16px_rgba(197,160,89,0.95)]',
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#a8863f] via-[#c5a059] to-[#d4b56e]"
      />
      {!reduce ? (
        <motion.span
          aria-hidden
          className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 0.9,
          }}
        />
      ) : null}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#8f7132] via-[#b8923f] to-[#c5a059] transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
      <span className="relative z-10 inline-flex items-center gap-2.5">
        {label}
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={1.75}
        />
      </span>
    </Link>
  );
}

export function Hero({
  eyebrow,
  title,
  subtitle,
  description,
  image,
  imageAlt = '',
  primaryCta,
  secondaryCta,
  scriptEyebrow = false,
  tall = true,
}: HeroProps) {
  const resolvedImage = resolveDestinationImage({
    image,
    name: title,
    slug: imageAlt,
  });

  return (
    <section
      className={`relative flex w-full items-end overflow-hidden ${
        tall ? 'min-h-[100svh]' : 'min-h-[70svh]'
      }`}
    >
      <ParallaxHeroMedia>
        <Image
          src={resolvedImage}
          alt={imageAlt || title}
          fill
          priority
          className="scale-105 object-cover"
          sizes="100vw"
        />
      </ParallaxHeroMedia>
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-40 lg:px-8">
        {eyebrow ? (
          <TextReveal delay={0.05}>
            <p
              className={
                scriptEyebrow
                  ? 'mb-3 font-[family-name:var(--font-script)] text-2xl text-[var(--color-gold)] md:text-3xl'
                  : 'mb-3 text-xs tracking-[0.25em] text-[var(--color-gold)] uppercase'
              }
            >
              {eyebrow}
            </p>
          </TextReveal>
        ) : null}
        <FadeIn delay={0.15} direction="up" distance={48} blur duration={1}>
          <h1 className="max-w-3xl font-[family-name:var(--font-display)] text-5xl leading-[1.05] text-white md:text-7xl lg:text-8xl">
            {title}
          </h1>
        </FadeIn>
        {subtitle ? (
          <FadeIn delay={0.28} direction="up" distance={28}>
            <p className="mt-4 max-w-2xl text-lg font-medium text-white md:text-xl">
              {subtitle}
            </p>
          </FadeIn>
        ) : null}
        {description ? (
          <FadeIn delay={0.38} direction="up" distance={24}>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75">
              {description}
            </p>
          </FadeIn>
        ) : null}
        {(primaryCta || secondaryCta) && (
          <FadeIn delay={0.5} direction="up" distance={20}>
            <div className="mt-8 flex flex-wrap gap-4">
              {primaryCta ? (
                <HeroPrimaryCta label={primaryCta.label} href={primaryCta.href} />
              ) : null}
              {secondaryCta ? (
                <Button asChild variant="outline" size="lg">
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              ) : null}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
