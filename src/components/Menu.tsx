import classNames from 'classnames';
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';

// M3 menu pieces: a MenuList of 48dp MenuItems, split into groups by
// MenuDividers. StyledPopover draws the menu's surface; in a dialog the list
// sits on the dialog's.

type MenuListProps = {
  children?: ReactNode;
  /** Width (M3 menus are 112–280px wide) and margins. */
  className?: string;
};

export function MenuList({ children, className = '' }: MenuListProps) {
  // Rounded and clipped like the menu surface, so the first and last items'
  // state layers and focus rings stay inside its corners.
  return (
    <div
      className={classNames('py-2 overflow-hidden rounded-large', className)}
    >
      {children}
    </div>
  );
}

export function MenuDivider() {
  return <hr className="my-2 border-outline-variant" />;
}

type MenuItemCommonProps = {
  /** The label. */
  children?: ReactNode;
  /** A 24px leading icon. */
  icon?: ReactNode;
  /** Shown at the end: a check, a shortcut, a value. */
  trailing?: ReactNode;
  /** An action that deletes or removes something: shown in the error color. */
  destructive?: boolean;
  className?: string;
  style?: CSSProperties;
};

type MenuItemProps = MenuItemCommonProps &
  (
    | {
        to?: undefined;
        href?: undefined;
        onClick?: MouseEventHandler<HTMLButtonElement>;
        disabled?: boolean;
      }
    | {
        /** An in-app route: the item is a router link. */
        to: string;
        href?: undefined;
        onClick?: MouseEventHandler<HTMLAnchorElement>;
        disabled?: undefined;
      }
    | {
        /** Another site: the item is a link that opens in a new tab. */
        href: string;
        to?: undefined;
        onClick?: MouseEventHandler<HTMLAnchorElement>;
        disabled?: undefined;
      }
  );

export function MenuItem(props: MenuItemProps) {
  const { children, icon, trailing, destructive, className, style } = props;
  const disabled = !!props.disabled;

  const classes = classNames(
    'flex items-center gap-3 w-full h-12 px-3 text-left font-plain text-label-large whitespace-nowrap',
    'state-layer-flat outline-none focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-secondary focus-visible:-outline-offset-3',
    disabled
      ? 'text-on-surface/38 cursor-default'
      : destructive
        ? 'text-error'
        : 'text-on-surface',
    className
  );

  const content = (
    <>
      {icon && (
        <span
          className={classNames(
            'w-6 h-6 shrink-0 flex-center [&>svg]:w-6 [&>svg]:h-6',
            !disabled && !destructive && 'text-on-surface-variant'
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex-1 min-w-0 truncate">{children}</span>
      {trailing && (
        <span
          className={classNames(
            'shrink-0 flex-center',
            !disabled && !destructive && 'text-on-surface-variant'
          )}
        >
          {trailing}
        </span>
      )}
    </>
  );

  if (props.to !== undefined) {
    return (
      <Link
        to={props.to}
        onClick={props.onClick}
        className={classes}
        style={style}
      >
        {content}
      </Link>
    );
  }
  if (props.href !== undefined) {
    return (
      <a
        href={props.href}
        target="_blank"
        rel="noreferrer"
        onClick={props.onClick}
        className={classes}
        style={style}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={disabled}
      className={classes}
      style={style}
    >
      {content}
    </button>
  );
}
