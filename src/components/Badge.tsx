import type { ReactNode } from 'react';

export type BadgeColor = keyof typeof COLORS;

type BadgeProps = {
  children: ReactNode;
  className: string;
  color?: BadgeColor;
};

export default function Badge({
  children,
  className,
  color = 'blue',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center h-6 px-2 rounded-small font-plain text-label-medium ${COLORS[color]} ${className}`}
    >
      {children}
    </span>
  );
}

// A small M3 label chip. Blue is the primary container; green comes from the
// user color palette.
const COLORS = {
  blue: 'bg-primary-container text-on-primary-container',
  green: 'bg-user-green-container text-on-user-green-container',
};
