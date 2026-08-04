'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowUpRight, ArrowRight } from 'lucide-react';
import {
  DestinationsMegaMenu,
  DestinationsMobileAccordion,
} from '@/components/marketing/destinations-mega-menu';
import { cn } from '@/lib/utils';

function PlanCta({
  href,
  label,
  className,
  onClick,
  fullWidth = false,
}: {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'group relative inline-flex h-10 items-center justify-center overflow-hidden px-5',
        'text-[11px] font-semibold tracking-[0.18em] text-[#0c0c0c] uppercase',
        'shadow-[0_12px_30px_-14px_rgba(197,160,89,0.85)]',
        fullWidth && 'w-full',
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#a8863f] via-[#c5a059] to-[#d4b56e]"
      />
      {!reduce ? (
        <motion.span
          aria-hidden
          className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/35 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 1.1,
          }}
        />
      ) : null}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#8f7132] via-[#b8923f] to-[#c5a059] transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        {label}
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={1.75}
        />
      </span>
    </Link>
  );
}

const links = [
  { href: '/', label: 'Home' },
  { href: '/destinations', label: 'Destinations', dropdown: true },
  { href: '/experiences', label: 'Experiences' },
  { href: '/collections', label: 'Special Collections' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

function isActivePath(pathname: string, prefix: string, href: string) {
  const full = href === '/' ? prefix : `${prefix}${href}`;
  if (href === '/') return pathname === prefix || pathname === `${prefix}/`;
  return pathname === full || pathname.startsWith(`${full}/`);
}

export function Navbar({ locale = 'en' }: { locale?: string }) {
  const [open, setOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const prefix = `/${locale}`;
  const destCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isItineraryDetail = /\/itineraries\/[^/]+$/.test(pathname);
  const planHref = isItineraryDetail ? '#enquire' : `${prefix}/plan-your-journey`;
  const planLabel = isItineraryDetail ? 'Plan This Journey' : 'Plan Your Journey';

  const forceSolid =
    /\/itineraries(\/|$)/.test(pathname) ||
    /\/blog(\/|$)/.test(pathname) ||
    /\/about$/.test(pathname);
  const solid = forceSolid || scrolled || open || destOpen;

  const openDestinations = () => {
    if (destCloseTimer.current) clearTimeout(destCloseTimer.current);
    setDestOpen(true);
  };

  const scheduleCloseDestinations = () => {
    if (destCloseTimer.current) clearTimeout(destCloseTimer.current);
    destCloseTimer.current = setTimeout(() => setDestOpen(false), 120);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDestOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!destOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDestOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [destOpen]);

  useEffect(() => {
    return () => {
      if (destCloseTimer.current) clearTimeout(destCloseTimer.current);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        solid
          ? 'border-b border-white/10 bg-[#0c0c0c]/95 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.65)] backdrop-blur-xl'
          : 'border-b border-transparent bg-gradient-to-b from-black/70 via-black/35 to-transparent',
      )}
    >
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-5 lg:px-6 lg:py-5">
        <Link href={prefix} className="group flex shrink-0 flex-col leading-none">
          <span className="font-[family-name:var(--font-display)] text-2xl tracking-[0.22em] text-white uppercase md:text-[1.75rem] lg:text-3xl">
            Uncharted
          </span>
          <span className="font-[family-name:var(--font-script)] text-xl text-[#c5a059] md:text-2xl lg:text-[1.75rem]">
            Journeys
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-none border border-white/10 bg-white/[0.03] px-2 py-1.5 backdrop-blur-md xl:gap-1.5 lg:flex">
          {links.map((link) => {
            const active = isActivePath(pathname, prefix, link.href);

            if (link.dropdown) {
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={openDestinations}
                  onMouseLeave={scheduleCloseDestinations}
                  onFocus={openDestinations}
                >
                  <button
                    type="button"
                    className={cn(
                      'group relative flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300',
                      destOpen || active
                        ? 'text-[#c5a059]'
                        : 'text-white/80 hover:text-white',
                    )}
                    aria-expanded={destOpen}
                    aria-haspopup="true"
                    onClick={() => setDestOpen((v) => !v)}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        'h-3 w-3 opacity-70 transition-transform duration-300',
                        destOpen && 'rotate-180',
                      )}
                    />
                    <span
                      aria-hidden
                      className={cn(
                        'absolute inset-x-3 bottom-1 h-px origin-left bg-[#c5a059] transition-transform duration-500 ease-out',
                        destOpen || active
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </button>
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={`${prefix}${link.href === '/' ? '' : link.href}`}
                className={cn(
                  'group relative px-3 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300',
                  active ? 'text-[#c5a059]' : 'text-white/80 hover:text-white',
                )}
              >
                {link.label}
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-x-3 bottom-1 h-px origin-left bg-[#c5a059] transition-transform duration-500 ease-out',
                    active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 lg:block">
          <PlanCta href={planHref} label={planLabel} />
        </div>

        <button
          type="button"
          className={cn(
            'relative flex h-10 w-10 items-center justify-center border transition-colors duration-300 lg:hidden',
            open
              ? 'border-[#c5a059]/60 text-[#c5a059]'
              : 'border-white/25 text-white hover:border-[#c5a059]/50 hover:text-[#c5a059]',
          )}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-4 w-4" strokeWidth={1.5} /> : <Menu className="h-4 w-4" strokeWidth={1.5} />}
        </button>
      </div>

      {/* Desktop destinations mega menu */}
      <AnimatePresence>
        {destOpen ? (
          <motion.div
            key="dest-mega"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full hidden lg:block"
            onMouseEnter={openDestinations}
            onMouseLeave={scheduleCloseDestinations}
          >
            <DestinationsMegaMenu
              locale={locale}
              onNavigate={() => setDestOpen(false)}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-nav"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[#c5a059]/20 bg-[#0c0c0c] lg:hidden"
          >
            <div className="relative flex max-h-[min(78vh,720px)] flex-col overflow-y-auto px-6 pb-8 pt-2">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent" />

              <p className="mb-5 pt-4 text-[10px] font-medium tracking-[0.35em] text-[#c5a059]/80 uppercase">
                Navigate
              </p>

              <nav className="flex flex-col">
                {links.map((link, index) => {
                  if (link.dropdown) {
                    return (
                      <motion.div
                        key={link.href}
                        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: reduceMotion ? 0 : 0.04 * index,
                          duration: 0.35,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mb-2"
                      >
                        <DestinationsMobileAccordion
                          locale={locale}
                          onNavigate={() => setOpen(false)}
                        />
                      </motion.div>
                    );
                  }

                  const href = `${prefix}${link.href === '/' ? '' : link.href}`;
                  const active = isActivePath(pathname, prefix, link.href);

                  return (
                    <motion.div
                      key={link.href}
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: reduceMotion ? 0 : 0.04 * index,
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'group flex items-center justify-between border-b border-white/[0.08] py-4 transition-colors',
                          active ? 'border-[#c5a059]/35' : 'hover:border-white/20',
                        )}
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="font-[family-name:var(--font-display)] text-[11px] tracking-[0.2em] text-[#c5a059]/70">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={cn(
                              'font-[family-name:var(--font-display)] text-[15px] tracking-[0.16em] uppercase transition-colors',
                              active ? 'text-[#c5a059]' : 'text-white group-hover:text-[#c5a059]',
                            )}
                          >
                            {link.label}
                          </span>
                        </span>
                        <ArrowUpRight
                          className={cn(
                            'h-4 w-4 transition-all duration-300',
                            active
                              ? 'text-[#c5a059]'
                              : 'text-white/25 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#c5a059]',
                          )}
                          strokeWidth={1.25}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : 0.28, duration: 0.35 }}
                className="mt-8 space-y-5"
              >
                <PlanCta
                  href={planHref}
                  label={planLabel}
                  fullWidth
                  onClick={() => setOpen(false)}
                />
                <p className="text-center text-[10px] tracking-[0.22em] text-white/40 uppercase">
                  Bespoke journeys, crafted by hand
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
