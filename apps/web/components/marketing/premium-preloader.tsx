'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const SESSION_KEY = 'uj-preloader-seen';
const DURATION_MS = 3200;
const BOOT_CLASS = 'uj-booting';

const phrases = [
  'Beyond destinations',
  'Into experiences',
  'Crafted for you',
];

function shouldSkipPreloader(reduce: boolean | null) {
  if (reduce) return true;
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function lockBoot() {
  document.documentElement.classList.add(BOOT_CLASS);
  document.body.style.overflow = 'hidden';
}

function unlockBoot() {
  document.documentElement.classList.remove(BOOT_CLASS);
  document.body.style.overflow = '';
}

export function PremiumPreloader() {
  const reduce = useReducedMotion();
  // Start covered so the site never paints first during hydration.
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useLayoutEffect(() => {
    if (shouldSkipPreloader(reduce)) {
      setVisible(false);
      unlockBoot();
      return;
    }

    lockBoot();
    setVisible(true);
  }, [reduce]);

  useEffect(() => {
    if (!visible) return;
    if (shouldSkipPreloader(reduce)) return;

    lockBoot();
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
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
      // Unlock after the exit animation begins so the site fades in underneath.
      window.setTimeout(() => unlockBoot(), 280);
    }, DURATION_MS + 650);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(phraseTimer);
      window.clearTimeout(timer);
    };
  }, [visible, reduce]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        unlockBoot();
      }}
    >
      {visible ? (
        <motion.div
          data-uj-preloader
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto bg-[#030303] py-8 sm:py-10"
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
            className="relative z-10 flex w-full max-w-3xl flex-col items-center px-5 text-center sm:px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="mb-4 text-base text-[#c5a059] sm:mb-8 sm:text-lg [@media(max-height:700px)]:mb-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              ✦
            </motion.span>

            <motion.p
              className="mb-4 max-w-full text-[9px] font-semibold tracking-[0.28em] text-[#c5a059] uppercase sm:mb-7 sm:text-[11px] sm:tracking-[0.55em] [@media(max-height:700px)]:mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              Entering the journey
            </motion.p>

            <div className="w-full overflow-visible px-1">
              <motion.h1
                className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,8vw,4.5rem)] font-semibold tracking-[0.12em] text-white uppercase sm:tracking-[0.22em] md:tracking-[0.28em] lg:tracking-[0.34em]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.05, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                Uncharted
              </motion.h1>
            </div>

            <motion.p
              className="mt-1 font-[family-name:var(--font-script)] text-[clamp(1.75rem,7vw,3.75rem)] text-[#c5a059] sm:mt-2"
              initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              Journeys
            </motion.p>

            <motion.div
              className="mt-5 h-px w-16 origin-center bg-gradient-to-r from-transparent via-[#c5a059] to-transparent sm:mt-9 sm:w-24 [@media(max-height:700px)]:mt-4"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />

            <div className="relative mt-5 h-5 w-full max-w-[18rem] overflow-hidden sm:mt-8 sm:max-w-md md:max-w-lg [@media(max-height:700px)]:mt-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phrases[phraseIndex]}
                  className="absolute inset-0 px-2 text-[10px] font-medium tracking-[0.18em] text-white/45 uppercase sm:text-[12px] sm:tracking-[0.3em]"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {phrases[phraseIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="mt-8 w-full max-w-xl sm:mt-14 sm:max-w-2xl [@media(max-height:700px)]:mt-6">
              <div className="relative h-1 w-full overflow-hidden bg-white/10 md:h-1.5">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8f7132] via-[#c5a059] to-[#e0c57a]"
                  style={{ width: `${progress}%` }}
                />
                <motion.div
                  aria-hidden
                  className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/55 to-transparent sm:w-24 md:w-32"
                  animate={{ left: ['-25%', '120%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <div className="mt-4 flex flex-col items-center gap-2 text-[10px] tracking-[0.18em] text-white/40 uppercase sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:text-[12px] sm:tracking-[0.32em]">
                <span className="text-center sm:text-left">Preparing your experience</span>
                <span className="font-[family-name:var(--font-display)] text-base tracking-[0.2em] text-[#c5a059] md:text-lg">
                  {String(progress).padStart(2, '0')}
                  <span className="text-white/25">%</span>
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/45 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.3 }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
