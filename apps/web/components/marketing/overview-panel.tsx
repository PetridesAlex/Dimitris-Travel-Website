'use client';

import type { ReactNode } from 'react';
import { FadeIn, Stagger } from '@/components/motion/fade-in';
import { cn } from '@/lib/utils';

export function OverviewPanel({
  eyebrow = 'Overview',
  title,
  body,
  highlights,
  facts,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  highlights?: string[];
  facts: { label: string; value: string }[];
  action?: ReactNode;
  className?: string;
}) {
  return (
    <FadeIn
      className={cn('relative', className)}
      direction="up"
      distance={36}
      blur
      duration={0.9}
    >
      <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(12,12,12,0.28)] md:p-10 lg:p-12">
        <div className="pointer-events-none absolute top-0 left-0 h-full w-1 bg-[var(--color-gold)]" />
        <div className="pointer-events-none absolute -top-24 -right-16 h-48 w-48 rounded-full bg-[var(--color-gold)]/10 blur-3xl" />

        <p className="text-[11px] font-semibold tracking-[0.28em] text-[var(--color-gold)] uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-4xl leading-[1.08] text-[var(--color-ink)] md:text-5xl lg:text-[3.25rem]">
          {title}
        </h2>
        <div className="mt-5 h-px w-14 bg-[var(--color-gold)]" />

        <p className="mt-6 max-w-xl text-base leading-[1.8] text-[var(--color-ink)]/75 md:text-lg">
          {body}
        </p>

        {highlights && highlights.length > 0 ? (
          <ul className="mt-7 space-y-3">
            {highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-3 text-sm font-medium text-[var(--color-ink)] md:text-[15px]"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold)]" />
                {h}
              </li>
            ))}
          </ul>
        ) : null}

        <Stagger
          className="mt-9 grid gap-3 sm:grid-cols-2"
          stagger={0.07}
          direction="up"
        >
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-xl border border-black/[0.06] bg-[var(--color-cream)]/80 px-4 py-4 transition-colors hover:border-[var(--color-gold)]/35"
            >
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--color-gold)] uppercase">
                {fact.label}
              </p>
              <p className="mt-1.5 text-sm font-medium leading-snug text-[var(--color-ink)]">
                {fact.value}
              </p>
            </div>
          ))}
        </Stagger>

        {action ? <div className="mt-9">{action}</div> : null}
      </div>
    </FadeIn>
  );
}
