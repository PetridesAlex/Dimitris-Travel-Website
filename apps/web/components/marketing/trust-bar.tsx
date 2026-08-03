'use client';

import {
  Compass,
  Plane,
  BedDouble,
  Car,
  Camera,
  Headset,
} from 'lucide-react';
import { trustFeatures } from '@luxury-travel/config';
import { FadeIn, Stagger } from '@/components/motion/fade-in';

const icons = {
  compass: Compass,
  plane: Plane,
  bed: BedDouble,
  car: Car,
  camera: Camera,
  headset: Headset,
} as const;

export function TrustBar() {
  return (
    <section className="relative overflow-hidden border-y border-[#c5a059]/15 bg-[#f7f3eb]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/35 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-16">
        <FadeIn className="mb-10 text-center lg:mb-12">
          <p className="text-[10px] font-semibold tracking-[0.35em] text-[#c5a059] uppercase">
            The Uncharted Standard
          </p>
        </FadeIn>

        <Stagger
          className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-6 lg:gap-0"
          stagger={0.07}
          direction="up"
        >
          {trustFeatures.map((feature, index) => {
            const Icon = icons[feature.icon as keyof typeof icons] ?? Compass;
            const isLast = index === trustFeatures.length - 1;

            return (
              <div
                key={feature.title}
                className="relative flex flex-col items-center px-2 text-center lg:px-5"
              >
                {!isLast ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-3 right-0 hidden h-[calc(100%-0.75rem)] w-px bg-gradient-to-b from-transparent via-[#c5a059]/35 to-transparent lg:block"
                  />
                ) : null}

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#c5a059]/35 bg-white/40 shadow-[0_12px_40px_-24px_rgba(12,12,12,0.45)] backdrop-blur-sm transition duration-500 hover:border-[#c5a059] hover:bg-[#c5a059]/10">
                  <Icon className="h-5 w-5 text-[#c5a059]" strokeWidth={1.15} />
                </div>

                <h3 className="font-[family-name:var(--font-display)] text-[13px] leading-snug tracking-[0.08em] text-[#0c0c0c] uppercase md:text-sm">
                  {feature.title}
                </h3>
                <p className="mt-2 max-w-[11rem] text-[12px] leading-relaxed text-[#0c0c0c]/50">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
