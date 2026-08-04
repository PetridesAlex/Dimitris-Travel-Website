'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CalendarDays,
  Languages,
  Coins,
  Clock3,
  FileCheck2,
  CloudSun,
  Info,
} from 'lucide-react';
import { FadeIn, Stagger } from '@/components/motion/fade-in';
import { cn } from '@/lib/utils';

function iconForLabel(label: string) {
  const key = label.toLowerCase();
  if (key.includes('time to visit') || key.includes('best time')) return CalendarDays;
  if (key.includes('language')) return Languages;
  if (key.includes('currency')) return Coins;
  if (key.includes('time') || key.includes('zone')) return Clock3;
  if (key.includes('visa')) return FileCheck2;
  if (key.includes('weather')) return CloudSun;
  return Info;
}

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
  const reduce = useReducedMotion();

  return (
    <FadeIn
      className={cn('relative', className)}
      direction="up"
      distance={36}
      blur
      duration={0.9}
    >
      <div className="relative overflow-hidden border border-[#c5a059]/20 bg-[#0c0c0c] p-8 shadow-[0_30px_80px_-28px_rgba(12,12,12,0.55)] md:p-10 lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(197,160,89,0.14),transparent_50%)]" />
        <div className="pointer-events-none absolute top-0 left-0 h-full w-[3px] bg-gradient-to-b from-[#c5a059] via-[#c5a059]/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#c5a059]/60 via-[#c5a059]/20 to-transparent" />

        <div className="relative">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-[#c5a059] uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-4 max-w-xl font-[family-name:var(--font-display)] text-4xl leading-[1.08] text-white md:text-5xl lg:text-[3.25rem]">
            {title}
          </h2>
          <motion.div
            className="mt-5 h-px w-14 origin-left bg-[#c5a059]"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={reduce ? undefined : { scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />

          <p className="mt-6 max-w-xl text-base leading-[1.8] text-white/65 md:text-lg">
            {body}
          </p>

          {highlights && highlights.length > 0 ? (
            <ul className="mt-7 space-y-3">
              {highlights.map((h, i) => (
                <motion.li
                  key={h}
                  className="flex items-start gap-3 text-sm font-medium text-white/85 md:text-[15px]"
                  initial={reduce ? false : { opacity: 0, x: -10 }}
                  whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.45 }}
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c5a059] shadow-[0_0_10px_rgba(197,160,89,0.7)]" />
                  {h}
                </motion.li>
              ))}
            </ul>
          ) : null}

          <Stagger
            className="mt-9 grid gap-3 sm:grid-cols-2"
            stagger={0.08}
            direction="up"
          >
            {facts.map((fact, index) => {
              const Icon = iconForLabel(fact.label);
              return (
                <motion.div
                  key={fact.label}
                  className="group relative overflow-hidden border border-white/10 bg-white/[0.04] px-4 py-4 transition duration-500 hover:border-[#c5a059]/45 hover:bg-[#c5a059]/10"
                  whileHover={reduce ? undefined : { y: -4 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-[#c5a059] to-transparent transition-transform duration-500 group-hover:scale-x-100" />

                  <div className="flex items-start gap-3">
                    <div className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-[#c5a059]/35 text-[#c5a059] transition duration-500 group-hover:border-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-[#0c0c0c]">
                      {!reduce ? (
                        <motion.span
                          aria-hidden
                          className="absolute inset-0 border border-[#c5a059]/25"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.45, 0.1, 0.45],
                          }}
                          transition={{
                            duration: 2.8,
                            repeat: Infinity,
                            delay: index * 0.25,
                            ease: 'easeInOut',
                          }}
                        />
                      ) : null}
                      <Icon className="relative h-4 w-4" strokeWidth={1.5} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold tracking-[0.22em] text-[#c5a059] uppercase">
                        {fact.label}
                      </p>
                      <p className="mt-1.5 text-sm font-medium leading-snug text-white/85">
                        {fact.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </Stagger>

          {action ? <div className="mt-9">{action}</div> : null}
        </div>
      </div>
    </FadeIn>
  );
}
