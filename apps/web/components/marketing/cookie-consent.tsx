'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'uj-cookie-consent';

type ConsentValue = 'accepted' | 'essential';

export function CookieConsent({ locale = 'en' }: { locale?: string }) {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();
  const prefix = `/${locale}`;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      const timer = window.setTimeout(() => setVisible(true), 1200);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const save = (value: ConsentValue) => {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[90] p-4 md:p-6 lg:p-8"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: 28 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
        >
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />

          <div
            className={cn(
              'relative mx-auto max-w-4xl overflow-hidden border border-[#c5a059]/25 bg-[#0c0c0c]/95 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.75)] backdrop-blur-2xl',
              'px-5 py-5 md:px-8 md:py-6',
            )}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent" />
            <div className="pointer-events-none absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-[#c5a059] via-[#c5a059]/40 to-transparent" />

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
              <div className="flex min-w-0 flex-1 gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center border border-[#c5a059]/40 text-[#c5a059]">
                  <Cookie className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <p
                    id="cookie-consent-title"
                    className="font-[family-name:var(--font-display)] text-xl text-white md:text-2xl"
                  >
                    Cookies & preferences
                  </p>
                  <p
                    id="cookie-consent-desc"
                    className="mt-2 text-sm leading-relaxed text-white/55"
                  >
                    We use cookies to keep journeys smooth and understand how you explore our site.
                    Essential cookies are always on. By continuing, you agree to our{' '}
                    <Link
                      href={`${prefix}/terms`}
                      className="text-[#c5a059] underline decoration-[#c5a059]/35 underline-offset-4 transition hover:decoration-[#c5a059]"
                    >
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link
                      href={`${prefix}/privacy`}
                      className="text-[#c5a059] underline decoration-[#c5a059]/35 underline-offset-4 transition hover:decoration-[#c5a059]"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => save('essential')}
                  className="h-11 border border-white/20 px-5 text-[11px] font-semibold tracking-[0.18em] text-white/80 uppercase transition hover:border-white/40 hover:text-white"
                >
                  Essential only
                </button>
                <button
                  type="button"
                  onClick={() => save('accepted')}
                  className="h-11 bg-gradient-to-r from-[#a8863f] via-[#c5a059] to-[#d4b56e] px-6 text-[11px] font-semibold tracking-[0.18em] text-[#0c0c0c] uppercase shadow-[0_12px_30px_-14px_rgba(197,160,89,0.9)] transition hover:brightness-110"
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
