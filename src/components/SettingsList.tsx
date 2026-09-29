import classNames from 'classnames';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Toggle from './Toggle';
import { LIST_ITEM, LIST_ITEM_INTERACTIVE } from './lists/listItem';

// The rows of a settings sheet: sections of M3 list items in segmented
// lists, each a switch or an action with a leading icon.

export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="px-4 pt-4 pb-2 font-plain text-title-small text-on-surface-variant">
        {title}
      </h3>
      <div className="list-segmented">{children}</div>
    </section>
  );
}

/** A setting that's on or off: its label, and a switch at the end. Clicking
    the label flips it too. */
export function SettingsSwitch({
  label,
  enabled,
  onChange,
}: {
  label: string;
  enabled?: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div className={LIST_ITEM}>
      <Toggle
        label={label}
        enabled={enabled}
        onChange={onChange}
        spacing="between"
        className="flex-1 min-w-0"
        labelClassName="flex-1 min-w-0 mr-4 cursor-pointer"
      />
    </div>
  );
}

type SettingsActionProps = {
  icon: ReactNode;
  label: ReactNode;
  /** At the end of the row, e.g. a count. */
  trailing?: ReactNode;
  onClick?: () => void;
  /** Makes the row a link instead; onClick still runs on navigating. */
  to?: Parameters<typeof Link>[0]['to'];
  disabled?: boolean;
  /** In the error color, e.g. leaving a session. */
  destructive?: boolean;
};

/** An action: a leading 24dp icon and its label. */
export function SettingsAction({
  icon,
  label,
  trailing,
  onClick,
  to,
  disabled = false,
  destructive = false,
}: SettingsActionProps) {
  const className = classNames(
    LIST_ITEM,
    LIST_ITEM_INTERACTIVE,
    'w-full text-left disabled:pointer-events-none',
    disabled
      ? 'text-on-surface/38'
      : destructive
        ? 'text-error'
        : 'text-on-surface'
  );
  const content = (
    <>
      <span
        className={classNames(
          'flex-center w-6 h-6 shrink-0 [&>svg]:w-6 [&>svg]:h-6',
          !disabled && !destructive && 'text-on-surface-variant'
        )}
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0 truncate">{label}</span>
      {trailing}
    </>
  );

  if (to) {
    return (
      <Link to={to} onClick={onClick} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {content}
    </button>
  );
}
