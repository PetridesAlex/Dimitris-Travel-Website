'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

type Direction = 'up' | 'down' | 'left' | 'right' | 'none' | 'scale';

function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case 'up':
      return { y: distance, x: 0, scale: 1 };
    case 'down':
      return { y: -distance, x: 0, scale: 1 };
    case 'left':
      return { x: distance, y: 0, scale: 1 };
    case 'right':
      return { x: -distance, y: 0, scale: 1 };
    case 'scale':
      return { x: 0, y: 0, scale: 0.94 };
    default:
      return { x: 0, y: 0, scale: 1 };
  }
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  distance = 36,
  once = true,
  blur = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: Direction;
  distance?: number;
  once?: boolean;
  blur?: boolean;
}) {
  const reduce = useReducedMotion();
  const from = offsetFor(direction, distance);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        x: from.x,
        y: from.y,
        scale: from.scale,
        filter: blur ? 'blur(8px)' : 'blur(0px)',
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      viewport={{ once, margin: '-8% 0px -8% 0px', amount: 0.15 }}
      transition={{ duration, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  stagger = 0.1,
  delay = 0,
  direction = 'up',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  direction?: Direction;
}) {
  const reduce = useReducedMotion();
  const from = offsetFor(direction, 28);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-8% 0px -8% 0px', amount: 0.12 }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              className="h-full"
              variants={{
                hidden: {
                  opacity: 0,
                  x: from.x,
                  y: from.y,
                  scale: from.scale,
                },
                show: {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.7, ease },
                },
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealImage({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={cn('overflow-hidden', className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn('overflow-hidden', className)}
      initial={{ opacity: 0, clipPath: 'inset(10% 10% 10% 10%)' }}
      whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '-10%', amount: 0.2 }}
      transition={{ duration: 1.1, ease, delay }}
    >
      <motion.div
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.25, ease, delay }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function LazySection({
  children,
  className,
  id,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-6% 0px', amount: 0.08 }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.section>
  );
}

export function ParallaxHeroMedia({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  if (reduce) {
    return (
      <div ref={ref} className={cn('absolute inset-0', className)}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn('absolute inset-0 overflow-hidden', className)}>
      <motion.div style={{ y, scale: scrollScale }} className="absolute inset-[-14%]">
        <motion.div
          className="h-full w-full will-change-transform"
          animate={{
            scale: [1, 1.14, 1.08, 1.12, 1],
            x: ['0%', '-2.5%', '1.8%', '-1.2%', '0%'],
            y: ['0%', '1.8%', '-1.4%', '1%', '0%'],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function TextReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <FadeIn className={className} delay={delay} direction="up" distance={24} blur>
      {children}
    </FadeIn>
  );
}
