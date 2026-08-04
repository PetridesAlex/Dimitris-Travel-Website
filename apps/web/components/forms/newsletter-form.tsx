'use client';

import { useState, useTransition } from 'react';
import { z } from 'zod';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { subscribeNewsletter } from '@/features/enquiries/actions';
import { FadeIn } from '@/components/motion/fade-in';
import { cn } from '@/lib/utils';

const schema = z.string().email();

export function NewsletterForm({ locale = 'en' }: { locale?: string }) {
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();
  const reduce = useReducedMotion();

  return (
    <form
      className="w-full max-w-lg"
      onSubmit={(e) => {
        e.preventDefault();
        const parsed = schema.safeParse(email);
        if (!parsed.success) {
          setMessage({ type: 'err', text: 'Please enter a valid email address.' });
          return;
        }
        startTransition(async () => {
          await subscribeNewsletter(email, locale);
          setMessage({
            type: 'ok',
            text: 'Welcome aboard — inspiration is on its way.',
          });
          setEmail('');
        });
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>

      <div
        className={cn(
          'group relative flex flex-col gap-3 border border-white/15 bg-white/[0.03] p-2 transition duration-500 sm:flex-row sm:items-stretch sm:gap-0',
          focused && 'border-[#c5a059]/50 bg-white/[0.05]',
        )}
      >
        <div className="relative min-w-0 flex-1">
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (message) setMessage(null);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Your email address"
            autoComplete="email"
            className="h-12 w-full bg-transparent px-4 text-[15px] tracking-[0.02em] text-white outline-none placeholder:text-white/35 sm:h-14 sm:px-5"
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-x-4 bottom-2 h-px origin-left bg-[#c5a059] sm:inset-x-5"
            initial={false}
            animate={{ scaleX: focused || email ? 1 : 0, opacity: focused || email ? 1 : 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className={cn(
            'inline-flex h-12 items-center justify-center gap-2 bg-[#c5a059] px-6 text-[11px] font-semibold tracking-[0.22em] text-[#0c0c0c] uppercase',
            'transition duration-300 hover:bg-[#d4b56e] disabled:cursor-not-allowed disabled:opacity-60',
            'sm:h-14 sm:px-7',
          )}
        >
          {pending ? 'Sending…' : 'Subscribe'}
          {!pending ? <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} /> : null}
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] leading-relaxed tracking-[0.04em] text-white/35">
          No noise. Occasional notes from the road — unsubscribe anytime.
        </p>

        {message ? (
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'inline-flex items-center gap-1.5 text-[12px] font-medium',
              message.type === 'ok' ? 'text-[#c5a059]' : 'text-red-300/90',
            )}
          >
            {message.type === 'ok' ? (
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
            ) : null}
            {message.text}
          </motion.p>
        ) : null}
      </div>
    </form>
  );
}

export function NewsletterBand({ locale = 'en' }: { locale?: string }) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#141414] px-6 py-20 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(197,160,89,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_100%,rgba(197,160,89,0.04),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/40 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
        <FadeIn direction="left" distance={32} blur>
          <p className="text-[10px] font-semibold tracking-[0.35em] text-[#c5a059] uppercase">
            Newsletter
          </p>
          <motion.span
            aria-hidden
            className="mt-4 block h-px w-12 origin-left bg-[#c5a059]/70"
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={reduce ? undefined : { scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          />
          <h2 className="mt-5 font-[family-name:var(--font-display)] text-4xl leading-[1.1] text-white md:text-5xl lg:text-[3.25rem]">
            Journey inspiration,
            <span className="block text-white/90">quietly delivered</span>
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/50">
            Destinations worth knowing, stays we trust, and seasonal ideas — written for
            travellers who prefer fewer emails, and better ones.
          </p>
        </FadeIn>

        <FadeIn direction="right" distance={32} delay={0.12}>
          <NewsletterForm locale={locale} />
        </FadeIn>
      </div>
    </section>
  );
}
