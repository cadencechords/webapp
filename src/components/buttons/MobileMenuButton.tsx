import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { BUTTON_COLORS, type ButtonColor } from '../Button';

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
    ' font-plain text-label-large outline-hidden focus:outline-hidden state-layer-flat whitespace-nowrap overflow-hidden text-ellipsis';
  const widthClasses = full ? ' w-full ' : '';
  const colorClasses = disabled
    ? ' text-on-surface/38 cursor-default '
    : ` ${BUTTON_COLORS[color].text} `;

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
