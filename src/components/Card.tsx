import classNames from 'classnames';
import type { MouseEventHandler, ReactNode } from 'react';

type CardProps = {
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  /** M3 card type. Filled (surface-container-highest) by default. */
  variant?: keyof typeof VARIANTS;
  /** Shows a state layer on hover and press; on by default with `onClick`.
      Set it for a card inside a link. */
  interactive?: boolean;
};

export default function Card({
  children,
  className = '',
  onClick,
  variant = 'filled',
  interactive = !!onClick,
}: CardProps) {
  return (
    <div
      className={classNames(
        'rounded-medium py-3 px-5 relative text-on-surface',
        VARIANTS[variant],
        interactive && 'state-layer-flat cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

const VARIANTS = {
  filled: 'bg-surface-container-highest',
  elevated: 'bg-surface-container-low shadow-(--md-sys-elevation-level1)',
  outlined: 'bg-surface border border-outline-variant',
};
