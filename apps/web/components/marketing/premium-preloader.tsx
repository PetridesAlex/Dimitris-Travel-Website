'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const SESSION_KEY = 'uj-preloader-seen';
const DURATION_MS = 3200;

const phrases = [
  'Beyond destinations',
  'Into experiences',
  'Crafted for you',
];

export function PremiumPreloader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

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
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);

    const phraseTimer = window.setInterval(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }, 900);

    const timer = window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SESSION_KEY, '1');
      document.body.style.overflow = '';
    }, DURATION_MS + 650);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(phraseTimer);
      window.clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#030303]"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: 'blur(10px)',
            transition: { duration: 1.05, ease: [0.76, 0, 0.24, 1] },
          }}
          aria-hidden={!visible}
          role="status"
          aria-live="polite"
          aria-label="Loading Uncharted Journeys"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(197,160,89,0.12),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.78)_100%)]" />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.035] to-transparent"
            animate={{ x: ['-80%', '180%'] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.5 }}
          />

          <motion.div
            className="relative z-10 flex w-full max-w-3xl flex-col items-center px-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="mb-8 text-lg text-[#c5a059]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              ✦
            </motion.span>

            <motion.p
              className="mb-7 text-[11px] font-semibold tracking-[0.55em] text-[#c5a059] uppercase"
              initial={{ opacity: 0, letterSpacing: '0.85em' }}
              animate={{ opacity: 1, letterSpacing: '0.55em' }}
              transition={{ duration: 1.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Entering the journey
            </motion.p>

            <div className="overflow-hidden">
              <motion.h1
                className="font-[family-name:var(--font-display)] text-5xl font-semibold tracking-[0.34em] text-white uppercase md:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: '110%' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.05, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                Uncharted
              </motion.h1>
            </div>

            <motion.p
              className="mt-2 font-[family-name:var(--font-script)] text-4xl text-[#c5a059] md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              Journeys
            </motion.p>

            <motion.div
              className="mt-9 h-px w-24 origin-center bg-gradient-to-r from-transparent via-[#c5a059] to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />

            <div className="relative mt-8 h-5 w-72 overflow-hidden md:w-96">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phrases[phraseIndex]}
                  className="absolute inset-0 text-[12px] font-medium tracking-[0.3em] text-white/45 uppercase"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {phrases[phraseIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-14 w-full max-w-xl px-2 sm:max-w-2xl">
              <div className="relative h-1 w-full overflow-hidden bg-white/10 md:h-1.5">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8f7132] via-[#c5a059] to-[#e0c57a]"
                  style={{ width: `${progress}%` }}
                />
                <motion.div
                  aria-hidden
                  className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/55 to-transparent md:w-32"
                  animate={{ left: ['-25%', '120%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <div className="mt-5 flex items-center justify-between text-[12px] tracking-[0.32em] text-white/40 uppercase">
                <span>Preparing your experience</span>
                <span className="font-[family-name:var(--font-display)] text-base tracking-[0.2em] text-[#c5a059] md:text-lg">
                  {String(progress).padStart(2, '0')}
                  <span className="text-white/25">%</span>
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/45 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.3 }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
