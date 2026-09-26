import type { ReactNode } from 'react';
import { BACKGROUND_COLORS } from '../Button';
import type { ButtonColor } from '../Button';

type IconButtonProps = {
  children?: ReactNode;
  color?: ButtonColor;
  onClick: () => void;
  className?: string;
};

export default function IconButton({
  children,
  color,
  onClick,
  className,
}: IconButtonProps) {
  return (
    <button
      className={`focus:outline-hidden outline-hidden border-0 rounded-full ${BACKGROUND_COLORS[color]} items-center transition-all p-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
