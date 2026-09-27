import classNames from 'classnames';
import {
  forwardRef,
  type CSSProperties,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import LoadingIndicator from './feedback/LoadingIndicator';

export type ButtonColor =
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'gray'
  | 'black'
  | 'white';

export type ButtonSize =
  | 'square'
  | 'xs'
  | 'sm'
  | 'small'
  | 'md'
  | 'medium'
  // icon variant only
  | 'lg';

export type ButtonVariant = 'filled' | 'accent' | 'icon' | 'open' | 'outlined';

export type ButtonProps = {
  children?: ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  full?: boolean;
  bold?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onKeyUp?: KeyboardEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
  tabIndex?: number;
  name?: string;
  type?: 'button' | 'submit' | 'reset';
};

type VariantProps = Omit<ButtonProps, 'variant'>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'filled',
      color = 'blue',
      size = 'sm',
      full = false,
      bold = true,
      onClick,
      loading = false,
      disabled = false,
      className,
      onKeyUp,
      style,
      tabIndex,
      name,
      type = 'button',
    },
    ref
  ) => {
    const props = {
      children,
      color,
      size,
      full,
      bold,
      onClick,
      loading,
      disabled,
      className,
      onKeyUp,
      style,
      tabIndex,
      name,
      type,
    };
    if (variant === 'filled') {
      return <PrimaryButton {...props} ref={ref} />;
    }

    if (variant === 'accent') {
      return <AccentButton {...props} ref={ref} />;
    }

    if (variant === 'icon') {
      return <IconButton {...props} ref={ref} />;
    }

    // open → M3 text button, outlined → M3 outlined button
    return (
      <button
        className={classNames(
          baseClasses,
          sizeClasses[size],
          !bold && 'font-normal',
          variant === 'outlined' && 'border',
          disabled
            ? classNames(
                disabledContentClasses,
                variant === 'outlined' && 'border-on-surface/12'
              )
            : classNames(
                BUTTON_COLORS[color].text,
                variant === 'outlined' && 'border-outline-variant'
              ),
          full && 'w-full',
          className
        )}
        onClick={loading ? undefined : onClick}
        disabled={disabled}
        onKeyUp={onKeyUp}
        style={style}
        tabIndex={tabIndex}
        aria-label={name}
        type={type}
        ref={ref}
      >
        {loading ? <LoadingIndicator size={24} color="inherit" /> : children}
      </button>
    );
  }
);

export default Button;

// M3E standard icon button
const IconButton = forwardRef<HTMLButtonElement, VariantProps>(
  (
    { size = 'md', className, children, disabled, color = 'gray', ...props },
    ref
  ) => {
    return (
      <button
        disabled={disabled}
        className={classNames(
          // No display class: callers hide these with `hidden sm:block`.
          // Icons are display:block (preflight), so center them in the
          // minimum size with margins instead.
          baseClasses,
          '[&>svg]:mx-auto',
          iconSizes[size],
          disabled ? disabledContentClasses : ICON_COLORS[color],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// M3E filled button
const PrimaryButton = forwardRef<HTMLButtonElement, VariantProps>(
  (
    {
      size = 'md',
      className,
      children,
      loading,
      color = 'blue',
      full,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        disabled={disabled || loading}
        className={classNames(
          baseClasses,
          sizeClasses[size],
          disabled ? disabledContainerClasses : BUTTON_COLORS[color].filled,
          full && 'w-full',

          className
        )}
        {...props}
      >
        {loading ? <LoadingIndicator size={24} color="inherit" /> : children}
      </button>
    );
  }
);

// M3E tonal button
const AccentButton = forwardRef<HTMLButtonElement, VariantProps>(
  (
    {
      size,
      className,
      children,
      loading,
      color = 'blue',
      full,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classNames(
          baseClasses,
          size ? sizeClasses[size] : FALLBACK_SIZE,
          disabled ? disabledContainerClasses : BUTTON_COLORS[color].tonal,
          full && 'w-full',

          className
        )}
        {...props}
      >
        {loading ? <LoadingIndicator size={24} color="inherit" /> : children}
      </button>
    );
  }
);

/** Classes for one `color`, by the kind of button it's used on. */
export type ButtonColorClasses = {
  /** Filled container and the content on it. */
  filled: string;
  /** Tonal container and the content on it. */
  tonal: string;
  /** Content color on no container (text, outlined and icon buttons). */
  text: string;
};

// Colors that have an M3 role use it: blue is primary, red is error and
// purple is tertiary. Gray, black and white are neutral surfaces. The other
// hues have no role, so they use the user colors (src/utils/userColors.ts).
// Class names are spelled out so Tailwind can find them.
export const BUTTON_COLORS: Record<ButtonColor, ButtonColorClasses> = {
  blue: {
    filled: 'bg-primary text-on-primary',
    tonal: 'bg-secondary-container text-on-secondary-container',
    text: 'text-primary',
  },
  red: {
    filled: 'bg-error text-on-error',
    tonal: 'bg-error-container text-on-error-container',
    text: 'text-error',
  },
  purple: {
    filled: 'bg-tertiary text-on-tertiary',
    tonal: 'bg-tertiary-container text-on-tertiary-container',
    text: 'text-tertiary',
  },
  gray: {
    filled: 'bg-secondary text-on-secondary',
    tonal: 'bg-surface-container-highest text-on-surface-variant',
    text: 'text-on-surface-variant',
  },
  black: {
    filled: 'bg-inverse-surface text-inverse-on-surface',
    tonal: 'bg-surface-container-highest text-on-surface',
    text: 'text-on-surface',
  },
  white: {
    filled: 'bg-surface-container-lowest text-on-surface',
    tonal: 'bg-surface-container-lowest text-on-surface',
    text: 'text-surface-container-lowest',
  },
  green: {
    filled: 'bg-user-green text-on-user-green',
    tonal: 'bg-user-green-container text-on-user-green-container',
    text: 'text-user-green',
  },
  yellow: {
    filled: 'bg-user-yellow text-on-user-yellow',
    tonal: 'bg-user-yellow-container text-on-user-yellow-container',
    text: 'text-user-yellow',
  },
  indigo: {
    filled: 'bg-user-indigo text-on-user-indigo',
    tonal: 'bg-user-indigo-container text-on-user-indigo-container',
    text: 'text-user-indigo',
  },
  pink: {
    filled: 'bg-user-pink text-on-user-pink',
    tonal: 'bg-user-pink-container text-on-user-pink-container',
    text: 'text-user-pink',
  },
};

// Round, squaring toward --shape-morph-to while pressed; the state layer
// tints with the content color.
const baseClasses =
  'font-plain state-layer-flat focus-ring shape-morph disabled:cursor-default';

/** On-surface at 38% (content) and 12% (container): the M3 disabled look. */
const disabledContentClasses = 'text-on-surface/38';
const disabledContainerClasses = 'bg-on-surface/12 text-on-surface/38';

// M3E sizes XS (32), S (40) and M (56). The corners are half the height, in
// pixels rather than rounded-full, so the press morph animates smoothly.
const XS = 'h-8 px-3 text-label-large rounded-[16px] [--shape-morph-to:8px]';
const S = 'h-10 px-4 text-label-large rounded-[20px] [--shape-morph-to:8px]';
const M = 'text-title-medium rounded-[28px] [--shape-morph-to:12px]';

// Sizes without their own classes (square, and lg outside icon buttons)
const FALLBACK_SIZE = 'text-label-large rounded-full';

const sizeClasses: Record<ButtonSize, string> = {
  square: FALLBACK_SIZE,
  xs: XS,
  sm: S,
  small: S,
  md: `h-14 px-6 ${M}`,
  medium: `w-20 h-14 ${M}`,
  lg: FALLBACK_SIZE,
};

// Standard icon buttons use on-surface-variant; blue is primary.
const ICON_COLORS: Partial<Record<ButtonColor, string>> = {
  gray: 'text-on-surface-variant',
  blue: 'text-primary',
};

// text-label-large keeps the old text-sm, which icons sized in em inherit.
const iconSizes: Record<ButtonSize, string> = {
  square: FALLBACK_SIZE,
  xs: FALLBACK_SIZE,
  small: FALLBACK_SIZE,
  medium: FALLBACK_SIZE,
  sm: 'text-label-large min-w-8 min-h-8 p-1 rounded-[16px] [--shape-morph-to:8px]',
  md: 'text-label-large min-w-10 min-h-10 p-2 rounded-[20px] [--shape-morph-to:8px]',
  lg: 'text-label-large min-w-14 min-h-14 p-3 rounded-[28px] [--shape-morph-to:12px]',
};
