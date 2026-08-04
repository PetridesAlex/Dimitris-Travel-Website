'use client';

import {
  Compass,
  Plane,
  BedDouble,
  Car,
  Camera,
  Headset,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { trustFeatures } from '@luxury-travel/config';
import { FadeIn } from '@/components/motion/fade-in';

const icons = {
  compass: Compass,
  plane: Plane,
  bed: BedDouble,
  car: Car,
  camera: Camera,
  headset: Headset,
} as const;

const ease = [0.22, 1, 0.36, 1] as const;

export function TrustBar() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-y border-[#c5a059]/20 bg-[#f7f3eb]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(197,160,89,0.07),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <FadeIn className="mb-12 text-center lg:mb-14" blur>
          <motion.p
            className="text-[11px] font-semibold tracking-[0.38em] text-[#c5a059] uppercase"
            initial={reduce ? false : { opacity: 0, letterSpacing: '0.5em' }}
            whileInView={reduce ? undefined : { opacity: 1, letterSpacing: '0.38em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
          >
            The Uncharted Standard
          </motion.p>
          <motion.span
            aria-hidden
            className="mx-auto mt-4 block h-px w-12 origin-center bg-[#c5a059]"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={reduce ? undefined : { scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          />
        </FadeIn>

        <motion.div
          className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-6 lg:gap-0"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.09, delayChildren: 0.1 },
            },
          }}
        >
          {trustFeatures.map((feature, index) => {
            const Icon = icons[feature.icon as keyof typeof icons] ?? Compass;
            const isLast = index === trustFeatures.length - 1;

            return (
              <motion.div
                key={feature.title}
                className="group relative flex h-full flex-col items-center px-2 text-center lg:px-4"
                variants={{
                  hidden: reduce
                    ? { opacity: 1 }
                    : { opacity: 0, y: 36, scale: 0.92 },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.75, ease },
                  },
                }}
                whileHover={reduce ? undefined : { y: -8 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              >
                {!isLast ? (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute top-8 right-0 hidden h-[calc(100%-2rem)] w-px origin-top bg-gradient-to-b from-[#c5a059]/50 via-[#c5a059]/20 to-transparent lg:block"
                    initial={reduce ? false : { scaleY: 0 }}
                    whileInView={reduce ? undefined : { scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.35 + index * 0.08, ease }}
                  />
                ) : null}

                <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-[#c5a059]/35"
                    animate={
                      reduce
                        ? undefined
                        : {
                            scale: [1, 1.18, 1],
                            opacity: [0.55, 0.15, 0.55],
                          }
                    }
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      delay: index * 0.28,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.span
                    aria-hidden
                    className="absolute -inset-1.5 rounded-full border border-[#c5a059]/15"
                    animate={
                      reduce
                        ? undefined
                        : {
                            scale: [1, 1.12, 1],
                            opacity: [0.4, 0.05, 0.4],
                          }
                    }
                    transition={{
                      duration: 3.4,
                      repeat: Infinity,
                      delay: index * 0.28 + 0.4,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.div
                    className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-[#c5a059]/55 bg-white text-[#c5a059] shadow-[0_14px_40px_-18px_rgba(197,160,89,0.85)] transition-colors duration-500 group-hover:border-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-[#0c0c0c]"
                    whileHover={reduce ? undefined : { rotate: -8, scale: 1.06 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.6} />
                  </motion.div>
                </div>

                <p className="mb-2 font-[family-name:var(--font-display)] text-[11px] tracking-[0.28em] text-[#c5a059]">
                  {String(index + 1).padStart(2, '0')}
                </p>

                <h3 className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-snug tracking-[0.08em] text-[#0c0c0c] uppercase transition-colors duration-300 group-hover:text-[#c5a059] md:text-base">
                  {feature.title}
                </h3>
                <span
                  aria-hidden
                  className="mt-3 block h-px w-6 bg-[#c5a059]/55 transition-all duration-500 group-hover:w-10 group-hover:bg-[#c5a059]"
                />
                <p className="mt-3.5 max-w-[13.5rem] font-[family-name:var(--font-display)] text-[14px] font-normal leading-[1.65] tracking-[0.01em] text-[#0c0c0c]/70 md:max-w-[14.5rem] md:text-[15px] md:leading-[1.7]">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
