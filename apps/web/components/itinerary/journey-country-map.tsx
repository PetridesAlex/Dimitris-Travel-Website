'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import countryMapPaths from '@/data/country-map-paths.json';

type MapStop = { label: string; x: number; y: number };

type LabeledStop = MapStop & {
  lx: number;
  ly: number;
  anchor: 'start' | 'end' | 'middle';
};

type CountryMapData = {
  viewBox: string;
  path: string;
  neighbors: string[];
  stops: Record<string, { x: number; y: number }>;
};

type Box = { x1: number; y1: number; x2: number; y2: number };

const maps = countryMapPaths as Record<string, CountryMapData>;

function resolveStops(countryName: string, labels: string[]): MapStop[] {
  const config = maps[countryName] ?? maps.Italy;
  return labels.map((label, i) => {
    const known = config.stops[label];
    if (known) return { label, ...known };
    const t = (i + 1) / (labels.length + 1);
    return { label, x: 120 + t * 480, y: 60 + (i % 2) * 40 + t * 120 };
  });
}

function routePath(stops: MapStop[]) {
  if (stops.length < 2) return '';
  return stops.map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x} ${s.y}`).join(' ');
}

function estimateLabelWidth(text: string) {
  return Math.max(36, text.length * 6.1);
}

function overlaps(a: Box, b: Box, pad = 4) {
  return !(
    a.x2 + pad < b.x1 ||
    a.x1 - pad > b.x2 ||
    a.y2 + pad < b.y1 ||
    a.y1 - pad > b.y2
  );
}

function labelBox(
  lx: number,
  ly: number,
  width: number,
  height: number,
  anchor: LabeledStop['anchor'],
): Box {
  const left =
    anchor === 'end' ? lx - width : anchor === 'middle' ? lx - width / 2 : lx;
  return {
    x1: left,
    y1: ly - height + 3,
    x2: left + width,
    y2: ly + 3,
  };
}

function parseViewBox(viewBox: string) {
  const [minX, minY, width, height] = viewBox.split(/\s+/).map(Number);
  return { minX, minY, width, height };
}

/** Fan labels away from markers so city names stay readable. */
function placeLabels(stops: MapStop[], viewBox: string): LabeledStop[] {
  const vb = parseViewBox(viewBox);
  const candidates: Array<{ dx: number; dy: number; anchor: LabeledStop['anchor'] }> = [
    { dx: 12, dy: -10, anchor: 'start' },
    { dx: -12, dy: -10, anchor: 'end' },
    { dx: 12, dy: 16, anchor: 'start' },
    { dx: -12, dy: 16, anchor: 'end' },
    { dx: 14, dy: 3, anchor: 'start' },
    { dx: -14, dy: 3, anchor: 'end' },
    { dx: 0, dy: -22, anchor: 'middle' },
    { dx: 0, dy: 22, anchor: 'middle' },
    { dx: 22, dy: -18, anchor: 'start' },
    { dx: -22, dy: -18, anchor: 'end' },
    { dx: 22, dy: 20, anchor: 'start' },
    { dx: -22, dy: 20, anchor: 'end' },
  ];

  const placed: LabeledStop[] = [];
  const boxes: Box[] = [];
  const markerR = 11;

  stops.forEach((stop, index) => {
    const text = `${String(index + 1).padStart(2, '0')} ${stop.label}`;
    const width = estimateLabelWidth(text);
    const height = 13;
    let best: LabeledStop | null = null;
    let bestScore = -Infinity;

    for (const c of candidates) {
      const lx = stop.x + c.dx;
      const ly = stop.y + c.dy;
      const box = labelBox(lx, ly, width, height, c.anchor);

      const inBounds =
        box.x1 >= vb.minX + 4 &&
        box.x2 <= vb.minX + vb.width - 4 &&
        box.y1 >= vb.minY + 4 &&
        box.y2 <= vb.minY + vb.height - 4;

      if (!inBounds) continue;
      if (boxes.some((b) => overlaps(box, b))) continue;

      // Prefer not sitting on other markers
      const hitsMarker = stops.some((other, j) => {
        if (j === index) return false;
        const mx1 = other.x - markerR;
        const mx2 = other.x + markerR;
        const my1 = other.y - markerR;
        const my2 = other.y + markerR;
        return overlaps(box, { x1: mx1, y1: my1, x2: mx2, y2: my2 }, 2);
      });
      if (hitsMarker) continue;

      // Prefer shorter offsets + top-right bias
      const dist = Math.hypot(c.dx, c.dy);
      const score = 100 - dist + (c.dy < 0 ? 8 : 0) + (c.anchor === 'start' ? 2 : 0);
      if (score > bestScore) {
        bestScore = score;
        best = { ...stop, lx, ly, anchor: c.anchor };
      }
    }

    if (!best) {
      // Fallback: staggered vertical stack to the side of the cluster
      const side = stop.x > vb.minX + vb.width / 2 ? -1 : 1;
      const lx = stop.x + side * (18 + (index % 3) * 6);
      const ly = stop.y - 14 + index * 15;
      best = {
        ...stop,
        lx,
        ly,
        anchor: side < 0 ? 'end' : 'start',
      };
    }

    placed.push(best);
    boxes.push(
      labelBox(
        best.lx,
        best.ly,
        width,
        height,
        best.anchor,
      ),
    );
  });

  return placed;
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
  const labeled = placeLabels(stops, config.viewBox);
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

            {labeled.map((stop, index) => {
              const title = `${String(index + 1).padStart(2, '0')} ${stop.label}`;
              const needsLeader =
                Math.hypot(stop.lx - stop.x, stop.ly - stop.y) > 16;

              return (
                <g key={`${stop.label}-${index}`}>
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

                  {needsLeader ? (
                    <line
                      x1={stop.x}
                      y1={stop.y}
                      x2={stop.lx}
                      y2={stop.ly - 2}
                      stroke="rgba(197,160,89,0.45)"
                      strokeWidth={0.7}
                    />
                  ) : null}

                  {/* Soft plate behind text for contrast */}
                  <motion.text
                    x={stop.lx}
                    y={stop.ly}
                    fill="#0c0c0c"
                    fontSize={11}
                    fontWeight={600}
                    letterSpacing="0.04em"
                    textAnchor={stop.anchor}
                    stroke="#0c0c0c"
                    strokeWidth={3.5}
                    paintOrder="stroke"
                    strokeLinejoin="round"
                    initial={reduce ? false : { opacity: 0 }}
                    whileInView={reduce ? undefined : { opacity: 0.55 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.08 }}
                  >
                    {title}
                  </motion.text>
                  <motion.text
                    x={stop.lx}
                    y={stop.ly}
                    fill="#f7f3eb"
                    fontSize={11}
                    fontWeight={500}
                    letterSpacing="0.04em"
                    textAnchor={stop.anchor}
                    initial={reduce ? false : { opacity: 0 }}
                    whileInView={reduce ? undefined : { opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.55 + index * 0.08 }}
                  >
                    {title}
                  </motion.text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
