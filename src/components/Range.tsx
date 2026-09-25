type RangeProps = {
  className?: string;
  step?: number;
  max?: number;
  min?: number;
  onChange?: (value: number) => void;
  value?: number;
};

export default function Range({
  className = '',
  step,
  max,
  min,
  onChange,
  value,
}: RangeProps) {
  return (
    <input
      type="range"
      className={`w-full ${className}`}
      step={step}
      max={max}
      min={min}
      onChange={e => onChange?.(parseInt(e.target.value))}
      value={value}
    />
  );
}
