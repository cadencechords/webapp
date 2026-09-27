import type { CSSProperties } from 'react';

type RangeProps = {
  className?: string;
  step?: number;
  max?: number;
  min?: number;
  onChange?: (value: number) => void;
  value?: number;
};

// M3 Expressive slider on a native range input, so keyboard and ARIA stay
// the browser's. The track (src/styles/slider.css) is painted from --value,
// the fraction the value is along the range, with a gap around the handle;
// the value indicator shows while dragging or focused from the keyboard.
export default function Range({
  className = '',
  step,
  max,
  min,
  onChange,
  value,
}: RangeProps) {
  // The native input's defaults: 0 to 100, starting halfway.
  const lower = min ?? 0;
  const upper = max ?? 100;
  const current = value ?? (lower + upper) / 2;
  const fraction =
    upper > lower
      ? Math.min(1, Math.max(0, (current - lower) / (upper - lower)))
      : 0;

  return (
    <span
      className="relative block w-full"
      style={{ '--value': fraction } as CSSProperties}
    >
      <input
        type="range"
        className={`m3-slider peer w-full ${className}`}
        step={step}
        max={max}
        min={min}
        onChange={e => onChange?.(parseInt(e.target.value))}
        value={value}
      />
      {value !== undefined && (
        <span
          aria-hidden="true"
          className="absolute bottom-full mb-1 -translate-x-1/2 min-w-12 px-4 py-3 rounded-full bg-inverse-surface text-inverse-on-surface font-plain text-label-large text-center pointer-events-none opacity-0 scale-75 transition-fast-effects peer-active:opacity-100 peer-active:scale-100 peer-focus-visible:opacity-100 peer-focus-visible:scale-100"
          style={{ left: 'calc(var(--value) * (100% - 4px) + 2px)' }}
        >
          {value}
        </span>
      )}
    </span>
  );
}
