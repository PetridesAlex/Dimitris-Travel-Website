'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { FadeIn, RevealImage } from '@/components/motion/fade-in';
import { cn } from '@/lib/utils';

type Props = {
  href: string;
  name: string;
  description: string;
  image: string;
  index?: number;
  size?: 'default' | 'large';
  className?: string;
};

export function DestinationCard({
  href,
  name,
  description,
  image,
  index = 0,
  size = 'default',
  className,
}: Props) {
  const reduce = useReducedMotion();
  const large = size === 'large';

  return (
    <FadeIn
      className={cn(
        'group relative overflow-hidden',
        large ? 'min-h-[420px] md:min-h-[520px] lg:min-h-[560px]' : 'min-h-[340px] md:min-h-[420px] lg:min-h-[460px]',
        className,
      )}
      direction="up"
      distance={44}
      blur
      duration={0.9}
      delay={0.06 * index}
    >
      <Link href={href} className="absolute inset-0 block">
        <RevealImage className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            whileHover={reduce ? undefined : { scale: 1.06 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={image}
              alt={name}
              fill
              loading="lazy"
              className="object-cover"
              sizes={
                large
                  ? '(max-width:768px) 100vw, 50vw'
                  : '(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw'
              }
            />
          </motion.div>
        </RevealImage>

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 transition duration-700 group-hover:via-black/45" />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-700 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_30%_80%,rgba(197,160,89,0.22),transparent_55%)]" />

        <div
          className={cn(
            'absolute inset-x-0 bottom-0 flex flex-col justify-end',
            large ? 'p-7 md:p-9 lg:p-10' : 'p-6 md:p-7',
          )}
        >
          <p className="mb-3 text-[10px] font-semibold tracking-[0.28em] text-[#c5a059] uppercase">
            Continent {String(index + 1).padStart(2, '0')}
          </p>
          <h3
            className={cn(
              'font-[family-name:var(--font-display)] leading-[1.05] text-white',
              large ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-2xl md:text-3xl',
            )}
          >
            {name}
          </h3>
          <p
            className={cn(
              'mt-3 max-w-md leading-relaxed text-white/70',
              large ? 'text-sm md:text-base' : 'line-clamp-2 text-sm',
            )}
          >
            {description}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#c5a059] uppercase opacity-80 transition duration-500 group-hover:opacity-100">
            Explore
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.75}
            />
          </span>
        </div>
      </Link>
    </FadeIn>
  );
}
