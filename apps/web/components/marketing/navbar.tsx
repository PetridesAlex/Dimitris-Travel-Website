'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const prefix = `/${locale}`;

  const isItineraryDetail = /\/itineraries\/[^/]+$/.test(pathname);
  const planHref = isItineraryDetail ? '#enquire' : `${prefix}/plan-your-journey`;
  const planLabel = isItineraryDetail ? 'Plan This Journey' : 'Plan Your Journey';

  const forceSolid =
    /\/itineraries(\/|$)/.test(pathname) ||
    /\/blog(\/|$)/.test(pathname) ||
    /\/about$/.test(pathname);
  const solid = forceSolid || scrolled || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        solid
          ? 'border-b border-white/10 bg-[#0c0c0c]/95 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.65)] backdrop-blur-xl'
          : 'border-b border-transparent bg-gradient-to-b from-black/70 via-black/35 to-transparent',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8 lg:py-5">
        <Link href={prefix} className="group flex shrink-0 flex-col leading-none">
          <span className="font-[family-name:var(--font-display)] text-xl tracking-[0.2em] text-white uppercase">
            Uncharted
          </span>
          <span className="font-[family-name:var(--font-script)] text-lg text-[#c5a059]">
            Journeys
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={`${prefix}${link.href === '/' ? '' : link.href}`}
              className="flex items-center gap-1 text-[11px] font-semibold tracking-[0.18em] text-white uppercase transition-colors duration-300 hover:text-[#c5a059]"
            >
              {link.label}
              {link.dropdown ? <ChevronDown className="h-3 w-3 opacity-70" /> : null}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 lg:block">
          <Button asChild size="sm">
            <Link href={planHref}>{planLabel}</Link>
          </Button>
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
            <div className="relative flex max-h-[min(78vh,640px)] flex-col overflow-y-auto px-6 pb-8 pt-2">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent" />

              <p className="mb-5 pt-4 text-[10px] font-medium tracking-[0.35em] text-[#c5a059]/80 uppercase">
                Navigate
              </p>

              <nav className="flex flex-col">
                {links.map((link, index) => {
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
                <Button asChild className="w-full tracking-[0.18em]">
                  <Link href={planHref} onClick={() => setOpen(false)}>
                    {planLabel}
                  </Link>
                </Button>
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
