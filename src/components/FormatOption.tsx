import type { ReactNode } from 'react';

/** A format option's row: its label, then its control at the end. */
export default function FormatOption({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 min-h-14 font-plain">
      <span className="text-body-large text-on-surface">{label}</span>
      {children}
    </div>
  );
}
