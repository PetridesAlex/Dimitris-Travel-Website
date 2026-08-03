'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Compass,
  KeyRound,
  Sparkles,
  ShieldCheck,
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { SectionHeading } from '@/components/marketing/sections';
import { FadeIn, Stagger } from '@/components/motion/fade-in';
import { cn } from '@/lib/utils';

const pillars = [
  {
    icon: Compass,
    title: 'Bespoke by design',
    description:
      'Every itinerary begins with you — pace, passions, and the places that matter most.',
  },
  {
    icon: KeyRound,
    title: 'Insider access',
    description:
      'Private openings, after-hours museums, and tables that are otherwise impossible.',
  },
  {
    icon: Sparkles,
    title: 'Cinematic flow',
    description:
      'Days sequenced like a film — arrival, tension, release — never a checklist.',
  },
  {
    icon: ShieldCheck,
    title: 'Quiet concierge',
    description:
      'Calm, 24/7 support from the first conversation through the journey home.',
  },
] as const;

type Testimonial = {
  id: string;
  authorName: string;
  authorLocation: string;
  quote: string;
  tripLabel: string;
  rating: number;
};

function PillarCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: (typeof pillars)[number]['icon'];
  title: string;
  description: string;
  index: number;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="group relative h-full text-center lg:text-left">
      <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center lg:mx-0">
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full border border-[#c5a059]/25"
          initial={reduce ? false : { scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 * index, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          aria-hidden
          className="absolute -inset-1 rounded-full border border-[#c5a059]/10"
          animate={
            reduce
              ? undefined
              : {
                  scale: [1, 1.08, 1],
                  opacity: [0.35, 0.7, 0.35],
                }
          }
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
        />
        <motion.div
          className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#c5a059]/10 text-[#c5a059] transition duration-500 group-hover:bg-[#c5a059] group-hover:text-[#0c0c0c]"
          whileHover={reduce ? undefined : { rotate: -6, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <Icon className="h-5 w-5" strokeWidth={1.2} />
        </motion.div>
      </div>

      <p className="mb-2 font-[family-name:var(--font-display)] text-[11px] tracking-[0.28em] text-[#c5a059]/70">
        {String(index + 1).padStart(2, '0')}
      </p>
      <h3 className="font-[family-name:var(--font-display)] text-xl text-white md:text-2xl">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/55">{description}</p>
    </div>
  );
}

function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = items[active] ?? items[0];

  if (!current) return null;

  const go = (dir: -1 | 1) => {
    setActive((i) => (i + dir + items.length) % items.length);
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -top-6 left-0 text-[#c5a059]/20 md:-top-8">
        <Quote className="h-16 w-16 md:h-24 md:w-24" strokeWidth={1} />
      </div>

      <div className="relative min-h-[220px] md:min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={current.id}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="mb-5 flex gap-1">
              {Array.from({ length: current.rating }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={reduce ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <Star className="h-3.5 w-3.5 fill-[#c5a059] text-[#c5a059]" />
                </motion.span>
              ))}
            </div>

            <p className="max-w-3xl font-[family-name:var(--font-display)] text-2xl leading-snug text-white md:text-4xl md:leading-[1.25]">
              “{current.quote}”
            </p>

            <footer className="mt-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm tracking-wide text-[#c5a059]">{current.authorName}</p>
                <p className="mt-1 text-xs tracking-[0.18em] text-white/45 uppercase">
                  {current.authorLocation}
                  <span className="mx-2 text-[#c5a059]/40">·</span>
                  {current.tripLabel}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-display)] text-sm tracking-[0.2em] text-white/40">
                  {String(active + 1).padStart(2, '0')}
                  <span className="text-white/20"> / </span>
                  {String(items.length).padStart(2, '0')}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous testimonial"
                    className="flex h-10 w-10 items-center justify-center border border-white/15 text-white transition hover:border-[#c5a059]/60 hover:text-[#c5a059]"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next testimonial"
                    className="flex h-10 w-10 items-center justify-center border border-white/15 text-white transition hover:border-[#c5a059]/60 hover:text-[#c5a059]"
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex gap-2">
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Show testimonial ${i + 1}`}
            onClick={() => setActive(i)}
            className={cn(
              'h-px flex-1 transition-all duration-500',
              i === active ? 'bg-[#c5a059]' : 'bg-white/15 hover:bg-white/30',
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function WhyChooseUs({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="relative overflow-hidden bg-[#161616] px-6 py-24 lg:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(197,160,89,0.09),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_100%,rgba(197,160,89,0.05),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Why choose us"
          title="Travel, elevated"
          description="Cinematic planning, insider access, and calm support from the first conversation to the journey home."
          light
        />

        <Stagger
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
          stagger={0.1}
          direction="up"
        >
          {pillars.map((pillar, index) => (
            <PillarCard key={pillar.title} {...pillar} index={index} />
          ))}
        </Stagger>

        <FadeIn className="my-16 md:my-20" delay={0.15}>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c5a059]/35 to-transparent" />
        </FadeIn>

        <FadeIn delay={0.1} blur>
          <p className="mb-8 text-[10px] font-semibold tracking-[0.35em] text-[#c5a059] uppercase">
            Voices from the journey
          </p>
          <TestimonialCarousel items={testimonials} />
        </FadeIn>
      </div>
    </section>
  );
}
