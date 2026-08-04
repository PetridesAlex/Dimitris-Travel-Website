'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import countryMapPaths from '@/data/country-map-paths.json';

type MapStop = { label: string; x: number; y: number };

type CountryMapData = {
  viewBox: string;
  path: string;
  neighbors: string[];
  stops: Record<string, { x: number; y: number }>;
};

const maps = countryMapPaths as Record<string, CountryMapData>;

function resolveStops(countryName: string, labels: string[]): MapStop[] {
  const config = maps[countryName] ?? maps.Italy;
  return labels.map((label, i) => {
    const known = config.stops[label];
    if (known) return { label, ...known };
    const t = (i + 1) / (labels.length + 1);
    return { label, x: 70 + t * 140, y: 80 + t * 180 };
  });
}

function routePath(stops: MapStop[]) {
  if (stops.length < 2) return '';
  return stops.map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x} ${s.y}`).join(' ');
}

export function JourneyCountryMap({
  countryName,
  stopLabels,
  className,
}: {
  countryName: string;
  stopLabels: string[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const config = maps[countryName] ?? maps.Italy;
  const resolvedName = maps[countryName] ? countryName : 'Italy';
  const stops = resolveStops(resolvedName, stopLabels);
  const line = routePath(stops);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-[#c5a059]/25 bg-[#0c0c0c]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(197,160,89,0.16),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="relative flex h-full min-h-[240px] flex-col p-5 sm:p-6 md:min-h-[300px] md:p-7">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.28em] text-[#c5a059] uppercase">
              Route map
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-white md:text-3xl">
              {countryName}
            </p>
          </div>
          <p className="pb-1 text-[10px] tracking-[0.18em] text-white/40 uppercase">
            {stops.length} curated stops
          </p>
        </div>

        <div className="relative min-h-0 flex-1">
          <svg
            viewBox={config.viewBox}
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={`Map of ${countryName} showing journey stops`}
          >
            <defs>
              <linearGradient id="routeGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c5a059" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#c5a059" stopOpacity="1" />
                <stop offset="100%" stopColor="#c5a059" stopOpacity="0.45" />
              </linearGradient>
              <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {config.neighbors.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="rgba(255,255,255,0.03)"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={0.4}
              />
            ))}

            <motion.path
              d={config.path}
              fill="rgba(197,160,89,0.18)"
              stroke="rgba(197,160,89,0.85)"
              strokeWidth={1.1}
              initial={reduce ? false : { opacity: 0 }}
              whileInView={reduce ? undefined : { opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />

            {line ? (
              <motion.path
                d={line}
                fill="none"
                stroke="url(#routeGold)"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 5"
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.35, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            ) : null}

            {stops.map((stop, index) => (
              <g key={stop.label}>
                <motion.circle
                  cx={stop.x}
                  cy={stop.y}
                  r={9}
                  fill="none"
                  stroke="#c5a059"
                  strokeWidth={0.7}
                  initial={reduce ? false : { opacity: 0 }}
                  whileInView={
                    reduce
                      ? undefined
                      : { opacity: [0.55, 0.12, 0.55], scale: [1, 1.3, 1] }
                  }
                  viewport={{ once: false }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    delay: 0.45 + index * 0.18,
                    ease: 'easeInOut',
                  }}
                  style={{ transformOrigin: `${stop.x}px ${stop.y}px` }}
                />
                <motion.circle
                  cx={stop.x}
                  cy={stop.y}
                  r={4.2}
                  fill="#c5a059"
                  filter="url(#softGlow)"
                  initial={reduce ? false : { scale: 0, opacity: 0 }}
                  whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.4 + index * 0.1,
                    type: 'spring',
                    stiffness: 260,
                    damping: 18,
                  }}
                  style={{ transformOrigin: `${stop.x}px ${stop.y}px` }}
                />
                <circle cx={stop.x} cy={stop.y} r={1.5} fill="#0c0c0c" />
                <motion.text
                  x={stop.x + 8}
                  y={stop.y - 8}
                  fill="#f7f3eb"
                  fontSize={11}
                  letterSpacing="0.06em"
                  initial={reduce ? false : { opacity: 0 }}
                  whileInView={reduce ? undefined : { opacity: 0.92 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.55 + index * 0.08 }}
                >
                  {String(index + 1).padStart(2, '0')} {stop.label}
                </motion.text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
