import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { TEXT_COLORS, type ButtonColor } from '../Button';

type MobileMenuButtonProps = {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  full?: boolean;
  color?: ButtonColor;
  disabled?: boolean;
  className?: string;
  size?: keyof typeof SIZES;
  style?: CSSProperties;
};

export default function MobileMenuButton({
  children,
  onClick,
  full,
  color = 'black',
  disabled = false,
  className,
  size = 'md',
  style,
}: MobileMenuButtonProps) {
  let classes =
    ' font-semibold outline-hidden focus:outline-hidden text-sm transition-colors whitespace-nowrap overflow-hidden text-ellipsis';
  const widthClasses = full ? ' w-full ' : '';
  const colorClasses = disabled
    ? ' text-gray-600 dark:text-dark-gray-200 cursor-default '
    : ` ${TEXT_COLORS[color]} hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-dark-gray-600 dark:focus:bg-dark-gray-600 `;

  classes += widthClasses;
  classes += colorClasses;
  classes += SIZES[size];
  classes += ` ${className}`;
  return (
    <button
      onClick={onClick}
      className={classes}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}

const SIZES = {
  xs: 'py-1 px-4',
  sm: 'py-2 px-5',
  md: 'py-3 px-6',
  none: 'py-3 px-1',
};
