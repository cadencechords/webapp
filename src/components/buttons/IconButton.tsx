import type { ReactNode } from 'react';
import { BUTTON_COLORS } from '../Button';
import type { ButtonColor } from '../Button';

type IconButtonProps = {
  children?: ReactNode;
  color: ButtonColor;
  onClick?: () => void;
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
      // M3 filled icon button
      className={`state-layer-flat focus-ring border-0 rounded-full ${BUTTON_COLORS[color].filled} items-center transition-all p-2 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
