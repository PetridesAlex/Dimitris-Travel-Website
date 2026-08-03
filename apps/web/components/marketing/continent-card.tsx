'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Globe, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Props = {
  href: string;
  name: string;
  description: string;
  image: string;
  index?: number;
  featured?: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function ContinentCard({
  href,
  name,
  description,
  image,
  index = 0,
  featured = false,
}: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className={cn(
        'group relative h-full min-h-[420px] overflow-hidden rounded-2xl md:min-h-[520px] lg:min-h-[580px]',
        featured && 'md:min-h-[560px] lg:min-h-[640px] lg:-mt-8',
      )}
      initial={
        reduce
          ? false
          : { opacity: 0, y: 56, scale: 0.96, filter: 'blur(10px)' }
      }
      whileInView={
        reduce
          ? undefined
          : { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
      }
      viewport={{ once: true, margin: '-8%', amount: 0.2 }}
      transition={{
        duration: 0.95,
        ease,
        delay: index * 0.1,
      }}
      whileHover={reduce ? undefined : { y: -10 }}
    >
      <Link href={href} className="absolute inset-0 block">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            loading="lazy"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 22vw"
            className="object-cover transition-transform duration-[1.1s] ease-out will-change-transform group-hover:scale-110"
          />
        </div>

        {/* Atmospheric overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_40%,rgba(0,0,0,0.45)_100%)]" />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[linear-gradient(to_top,rgba(197,160,89,0.18),transparent_45%)]" />

        {/* Gold frame accent on hover */}
        <div className="pointer-events-none absolute inset-3 rounded-xl border border-transparent transition-all duration-500 group-hover:border-[var(--color-gold)]/50 group-hover:shadow-[inset_0_0_0_1px_rgba(197,160,89,0.2)]" />

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
          <div className="mb-3 flex items-center justify-between">
            <Globe
              className="h-4 w-4 text-[var(--color-gold)] transition-transform duration-500 group-hover:rotate-12"
              strokeWidth={1.25}
            />
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all duration-500 group-hover:border-[var(--color-gold)] group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-ink)]">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>

          <h3 className="font-[family-name:var(--font-display)] text-3xl leading-none tracking-wide text-white md:text-4xl">
            {name}
          </h3>
          <div className="mt-3 h-px w-10 origin-left bg-[var(--color-gold)] transition-all duration-500 group-hover:w-16" />
          <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-white/70 transition-colors duration-300 group-hover:text-white/90">
            {description}
          </p>
          <p className="mt-4 text-[10px] font-medium tracking-[0.22em] text-[var(--color-gold)] uppercase opacity-0 translate-y-2 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            Explore continent
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
