'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Globe, ArrowRight } from 'lucide-react';
import { FadeIn, RevealImage } from '@/components/motion/fade-in';

type Props = {
  href: string;
  name: string;
  description: string;
  image: string;
};

export function DestinationCard({ href, name, description, image }: Props) {
  return (
    <FadeIn
      className="group relative aspect-[3/4] overflow-hidden rounded-xl"
      direction="up"
      distance={44}
      blur
      duration={0.9}
    >
      <Link href={href} className="absolute inset-0">
        <RevealImage className="absolute inset-0">
          <Image
            src={image}
            alt={name}
            fill
            loading="lazy"
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 20vw"
          />
        </RevealImage>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <Globe className="mb-2 h-4 w-4 text-white/80" strokeWidth={1.25} />
          <h3 className="text-sm font-semibold tracking-[0.15em] text-white uppercase">
            {name}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/70">
            {description}
          </p>
          <ArrowRight className="mt-3 h-4 w-4 text-[var(--color-gold)] opacity-0 transition group-hover:opacity-100" />
        </div>
      </Link>
    </FadeIn>
  );
}
