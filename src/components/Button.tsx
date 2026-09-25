import classNames from 'classnames';
import {
  forwardRef,
  type CSSProperties,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactNode,
} from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

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
    const defaultClasses = ` outline-hidden focus:outline-hidden transition-colors text-sm ${
      className ? className : ''
    } `;
    let colorClasses = '';
    let disabledClasses = ' cursor-default ';
    const roundedClasses = ' rounded-full ';
    const sizeClasses = ` ${sizePaddings[size]} ${full ? ' w-full ' : ''}`;
    const fontClasses = ` ${bold ? ' font-semibold ' : ''} `;
    let loadingColor: string = color;

    if (color === 'blue' || color === 'black') loadingColor = '#1f6feb';

    if (variant === 'open') {
      colorClasses += ` ${TEXT_COLORS[color]}`;
      disabledClasses += ` text-gray-500 `;
    } else if (variant === 'outlined') {
      colorClasses += `  border-gray-300 dark:border-dark-gray-400 ${TEXT_COLORS[color]} bg-gray-100 focus:bg-gray-100 dark:bg-dark-gray-700 `;
      disabledClasses += `  border-gray-300 text-gray-500 dark:border-dark-gray-400 dark:text-dark-gray-200 `;
    }

    return (
      <button
        className={`
            ${disabled ? disabledClasses : colorClasses}
            ${sizeClasses} ${fontClasses} ${roundedClasses} ${defaultClasses}`}
        onClick={loading ? undefined : onClick}
        disabled={disabled}
        onKeyUp={onKeyUp}
        style={style}
        tabIndex={tabIndex}
        aria-label={name}
        type={type}
        ref={ref}
      >
        {loading ? <PulseLoader color={loadingColor} size={6} /> : children}
      </button>
    );
  }
);

export default Button;

const IconButton = forwardRef<HTMLButtonElement, VariantProps>(
  (
    { size = 'md', className, children, disabled, color = 'gray', ...props },
    ref
  ) => {
    return (
      <button
        disabled={disabled}
        className={classNames(
          defaultClasses,
          iconSizes[size],
          'rounded-full',
          !disabled && iconColors[color],
          disabled
            ? 'text-gray-500 dark:text-dark-gray-200 cursor-default'
            : 'hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-dark-gray-600 dark:focus:bg-dark-gray-600',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

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
          defaultClasses,
          sizePaddings[size],
          'text-white',
          disabled
            ? 'bg-gray-100 text-gray-500 dark:bg-dark-gray-400 dark:text-dark-gray-200 cursor-default'
            : BACKGROUND_COLORS[color],
          full && 'w-full',

          className
        )}
        {...props}
      >
        {loading ? <PulseLoader color="white" size={6} /> : children}
      </button>
    );
  }
);

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
          defaultClasses,
          sizePaddings[size],
          accentColors[color],
          disabled
            ? 'bg-gray-100 text-gray-500 dark:bg-dark-gray-400 dark:text-dark-gray-200 cursor-default'
            : 'bg-gray-100 focus:bg-gray-200 hover:bg-gray-200 dark:bg-dark-gray-700 dark:hover:bg-dark-gray-600 dark:focus:bg-dark-gray-600',
          full && 'w-full',

          className
        )}
        {...props}
      >
        {loading ? <PulseLoader color="currentColor" size={6} /> : children}
      </button>
    );
  }
);

const sizePaddings: Partial<Record<ButtonSize, string>> = {
  square: '',
  xs: ' px-4 min-h-7 h-7',
  sm: ' px-3 h-9 ',
  small: ' px-4 h-9 ',
  md: ' px-10 h-14 ',
  medium: ' w-20 h-14 ',
};

export const TEXT_COLORS: Record<ButtonColor, string> = {
  red: 'text-red-600 dark:text-dark-red',
  blue: 'text-blue-600 dark:text-dark-blue',
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  indigo: 'text-indigo-600',
  purple: 'text-purple-600 dark:text-purple-500',
  pink: 'text-pink-600',
  gray: 'text-gray-600 dark:text-dark-gray-200',
  black: 'text-black dark:text-dark-gray-200',
  white: 'text-white',
};

export const BACKGROUND_COLORS: Record<ButtonColor, string> = {
  red: 'bg-red-500 hover:bg-red-700 focus:bg-red-700',
  blue: 'bg-blue-600 hover:bg-blue-800 focus:bg-blue-800 dark:bg-dark-blue dark:hover:bg-blue-600 dark:focus:bg-blue-600',
  green:
    'bg-green-500 hover:bg-green-700 focus:bg-green-700 dark:bg-dark-green',
  yellow: 'bg-yellow-400 hover:bg-yellow-600 focus:bg-yellow-600',
  indigo: 'bg-indigo-600 hover:bg-indigo-800 focus:bg-indigo-800',
  purple: 'bg-purple-600 hover:bg-purple-800 focus:bg-purple-800',
  pink: 'bg-pink-500 hover:bg-pink-700 focus:bg-pink-700',
  gray: 'bg-gray-600 hover:bg-gray-800 focus:bg-gray-800',
  black: 'bg-black',
  white: 'bg-white dark:bg-dark-gray-800',
};

const defaultClasses =
  'outline-hidden focus:outline-hidden transition-colors text-sm rounded-full font-semibold tracking-wide';

const iconColors: Partial<Record<ButtonColor, string>> = {
  gray: 'text-gray-700 dark:text-dark-gray-200',
  blue: 'text-blue-600 dark:text-dark-blue',
};

const accentColors: Partial<Record<ButtonColor, string>> = {
  blue: 'text-blue-600 dark:text-dark-blue',
  red: 'text-red-600 dark:text-dark-red',
  purple: 'text-purple-600 dark:text-purple-500',
};
const iconSizes: Partial<Record<ButtonSize, string>> = {
  sm: 'p-1',
  md: 'p-2',
  lg: 'p-3',
};
