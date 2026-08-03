'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const SESSION_KEY = 'uj-preloader-seen';
const DURATION_MS = 2400;

export function PremiumPreloader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen || reduce) {
      setVisible(false);
      return;
    }

    setVisible(true);
    document.body.style.overflow = 'hidden';

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION_MS);
      // Ease-out cubic for premium feel
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);

    const timer = window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SESSION_KEY, '1');
      document.body.style.overflow = '';
    }, DURATION_MS + 400);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[var(--color-ink)]"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
          }}
          aria-hidden={!visible}
          role="status"
          aria-live="polite"
          aria-label="Loading Uncharted Journeys"
        >
          {/* Soft gold atmosphere */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.12),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:64px_64px]" />

          <motion.div
            className="relative z-10 flex flex-col items-center px-6 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.p
              className="mb-5 text-[10px] font-medium tracking-[0.45em] text-[var(--color-gold)] uppercase"
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, letterSpacing: '0.45em' }}
              transition={{ duration: 1.1, delay: 0.15 }}
            >
              Luxury travel
            </motion.p>

            <motion.h1
              className="font-[family-name:var(--font-display)] text-4xl tracking-[0.28em] text-white uppercase md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Uncharted
            </motion.h1>

            <motion.p
              className="mt-1 font-[family-name:var(--font-script)] text-3xl text-[var(--color-gold)] md:text-4xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.45 }}
            >
              Journeys
            </motion.p>

            <motion.div
              className="mt-10 h-px w-16 origin-center bg-[var(--color-gold)]"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />

            <p className="mt-8 max-w-xs text-xs leading-relaxed tracking-wide text-white/45">
              Crafting your next journey
            </p>

            {/* Progress rail */}
            <div className="mt-10 w-48 md:w-56">
              <div className="h-[1px] w-full overflow-hidden bg-white/10">
                <motion.div
                  className="h-full bg-[var(--color-gold)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] tracking-[0.2em] text-white/35 uppercase">
                <span>Loading</span>
                <span>{String(progress).padStart(2, '0')}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
