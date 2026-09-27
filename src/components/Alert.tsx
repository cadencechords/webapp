import classNames from 'classnames';
import type { ReactNode } from 'react';
import Icon from './Icon';
import type { OutlinedIconName } from './icons/registry';

type AlertProps = {
  dismissable?: boolean;
  /** The severity: red for errors, yellow for warnings, green for success,
      blue for information and gray for a neutral note. */
  color?: keyof typeof SEVERITIES;
  onDismiss?: () => void;
  children?: ReactNode;
  className?: string;
};

// An M3 inline banner: the severity's container color, a leading icon and
// body-medium text, with an optional dismiss button.
export default function Alert({
  dismissable = false,
  color = 'blue',
  onDismiss,
  children,
  className,
}: AlertProps) {
  const { container, icon } = SEVERITIES[color];
  return (
    <div
      className={classNames(
        'flex items-start gap-3 rounded-medium px-4 py-3 text-body-medium',
        container,
        className
      )}
    >
      <Icon name={icon} className="w-5 h-5 shrink-0 my-px" />
      <div className="flex-1 min-w-0">{children}</div>
      {dismissable && (
        <button
          type="button"
          aria-label="Dismiss"
          className="flex-center shrink-0 w-10 h-10 -my-2.5 -mr-2 rounded-full state-layer-flat focus-ring"
          onClick={onDismiss}
        >
          <Icon name="close" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

const SEVERITIES: Record<
  'red' | 'yellow' | 'green' | 'blue' | 'gray',
  { container: string; icon: OutlinedIconName }
> = {
  red: {
    container: 'bg-error-container text-on-error-container',
    icon: 'error',
  },
  yellow: {
    container: 'bg-tertiary-container text-on-tertiary-container',
    icon: 'warning',
  },
  green: {
    container: 'bg-tertiary-container text-on-tertiary-container',
    icon: 'check_circle',
  },
  blue: {
    container: 'bg-secondary-container text-on-secondary-container',
    icon: 'info',
  },
  gray: {
    container: 'bg-surface-container-highest text-on-surface-variant',
    icon: 'info',
  },
};
