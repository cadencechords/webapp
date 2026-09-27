import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

// The M3 Expressive indeterminate linear progress indicator: two primary
// segments chase along a secondary-container track, with 4px gaps and round
// caps, optionally wavy.
//
// Ported from m3e-canvas components/Loading.tsx (MIT License, Copyright (c)
// 2026 lnkiai, https://github.com/lnkiai/m3e-canvas), which follows
// material-components-android's linear indeterminate timings.

type LinearProgressProps = {
  /** A wave through the active segments (M3 Expressive's wavy style). */
  wavy?: boolean;
  /** Track thickness in px. */
  thickness?: number;
  className?: string;
};

const CYCLE_MS = 1800;
const TRACK_GAP = 4;
const WAVELENGTH = 40;
const AMPLITUDE = 3;
const WAVE_SPEED = 40; // px per second

/** A cubic-bezier easing, as CSS parametrizes it. */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const curve = (a: number, b: number) => (t: number) =>
    ((3 * a - 3 * b + 1) * t + (3 * b - 6 * a)) * t * t + 3 * a * t;
  const x = curve(x1, x2);
  const y = curve(y1, y2);
  return (progress: number) => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;
    // Bisect for the t where x(t) is the progress.
    let lo = 0;
    let hi = 1;
    let t = progress;
    for (let i = 0; i < 24; i++) {
      const value = x(t);
      if (Math.abs(value - progress) < 1e-4) break;
      if (value < progress) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return y(t);
  };
}

const head1 = bezier(0.2, 0, 0.8, 1);
const tail1 = bezier(0.4, 0, 1, 1);
const head2 = bezier(0, 0, 0.65, 1);
const tail2 = bezier(0.1, 0, 0.45, 1);

// Where in its stretch of the cycle `ms` is, eased: 0 before, 1 after.
const phase = (
  ms: number,
  from: number,
  to: number,
  ease: (x: number) => number
) => ease(Math.min(1, Math.max(0, (ms - from) / (to - from))));

/** The two active segments at `ms` into the cycle, as fractions 0..1 of the
    track: [start, end] each. */
export function segments(ms: number): [number, number][] {
  const t = ((ms % CYCLE_MS) + CYCLE_MS) % CYCLE_MS;
  return [
    [phase(t, 333, 1183, tail1), phase(t, 0, 750, head1)],
    [phase(t, 1267, 1800, tail2), phase(t, 1000, 1567, head2)],
  ];
}

/** A horizontal line from x0 to x1 at y `mid`, as a sine wave when `amp`. */
export function wavePath(
  x0: number,
  x1: number,
  mid: number,
  amp: number,
  wavePhase: number
) {
  if (x1 - x0 < 0.5) return '';
  const step = amp > 0 ? 2 : x1 - x0;
  let d = '';
  for (let x = x0; ; x += step) {
    const at = Math.min(x, x1);
    const y = mid + amp * Math.sin((2 * Math.PI * at) / WAVELENGTH + wavePhase);
    d += `${d ? 'L' : 'M'}${at.toFixed(2)} ${y.toFixed(2)}`;
    if (at >= x1) break;
  }
  return d;
}

// Decorative, like the bar it replaces: screen readers announce nothing.
export default function LinearProgress({
  wavy = false,
  thickness = 4,
  className,
}: LinearProgressProps) {
  const box = useRef<HTMLDivElement>(null);
  const active = useRef<SVGPathElement>(null);
  const track = useRef<SVGPathElement>(null);
  const [width, setWidth] = useState(0);
  const amplitude = wavy ? AMPLITUDE : 0;
  const height = thickness + amplitude * 2;

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    setWidth(element.clientWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setWidth(element.clientWidth));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!width) return;
    // Round caps overhang each end by half the thickness.
    const inset = thickness / 2;
    const length = width - thickness;
    const mid = height / 2;
    let start: number | null = null;
    let frame = requestAnimationFrame(function draw(now) {
      start ??= now;
      const ms = now - start;
      const wavePhase = (-(ms / 1000) * WAVE_SPEED * 2 * Math.PI) / WAVELENGTH;
      const spans = segments(ms)
        .map(([from, to]) => [inset + length * from, inset + length * to])
        .filter(([from, to]) => to - from > 0.5)
        .sort((a, b) => a[0] - b[0]);
      active.current?.setAttribute(
        'd',
        spans
          .map(([from, to]) => wavePath(from, to, mid, amplitude, wavePhase))
          .join('')
      );
      // The track fills what's left, a gap (plus the caps) from each segment.
      let cursor = inset;
      let d = '';
      for (const [from, to] of spans) {
        d += wavePath(cursor, from - TRACK_GAP - thickness, mid, 0, 0);
        cursor = Math.max(cursor, to + TRACK_GAP + thickness);
      }
      d += wavePath(cursor, inset + length, mid, 0, 0);
      track.current?.setAttribute('d', d);
      frame = requestAnimationFrame(draw);
    });
    return () => cancelAnimationFrame(frame);
  }, [width, thickness, height, amplitude]);

  const stroke = {
    fill: 'none',
    strokeWidth: thickness,
    strokeLinecap: 'round' as const,
  };
  return (
    <div
      ref={box}
      aria-hidden="true"
      data-linear-progress
      className={classNames('w-full', className)}
      style={{ height }}
    >
      {width > 0 && (
        <svg width={width} height={height} className="block">
          <path
            ref={track}
            className="stroke-secondary-container"
            {...stroke}
          />
          <path ref={active} className="stroke-primary" {...stroke} />
        </svg>
      )}
    </div>
  );
}
