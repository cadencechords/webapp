import classNames from 'classnames';
import { Children, Fragment, isValidElement } from 'react';
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { MENU_SURFACE } from './StyledPopover';
import { Link } from 'react-router-dom';

// M3 Expressive menu pieces: a MenuList of 44dp (compact) MenuItems, split into groups
// by MenuDividers. Items sit 4dp inside the menu with 12dp corners (concentric
// with its 16dp), so hover, focus and selected states are pills inside it.
// StyledPopover draws the menu's surface; in a dialog the list sits on the
// dialog's.

type MenuListProps = {
  children?: ReactNode;
  /** Width (M3 menus are 112–280px wide) and margins. */
  className?: string;
};

export function MenuList({ children, className = '' }: MenuListProps) {
  // Dividers split the items into groups: the M3 Expressive disconnected
  // menu, each group its own surface, 2dp apart. (StyledPopover's surface
  // turns transparent around them, via data-menu-groups.)
  // Dividers count inside fragments too ({canDelete && <><MenuDivider />…</>}).
  const groups: ReactNode[][] = [[]];
  // toArray keys each child, so the groups render as keyed arrays.
  const collect = (nodes: ReactNode) =>
    Children.toArray(nodes).forEach(child => {
      if (!isValidElement(child)) groups[groups.length - 1].push(child);
      else if (child.type === MenuDivider) groups.push([]);
      else if (child.type === Fragment)
        collect((child.props as { children?: ReactNode }).children);
      else groups[groups.length - 1].push(child);
    });
  collect(children);
  // A divider with nothing before or after it (a menu that's only Delete)
  // leaves no empty group.
  const filled = groups.filter(group => group.length > 0);

  // One group: 4dp of padding round the items, on the popover's surface.
  if (filled.length <= 1)
    return (
      <div className={classNames('flex flex-col p-1 rounded-large', className)}>
        {children}
      </div>
    );

  return (
    <div
      data-menu-groups
      className={classNames('flex flex-col gap-0.5', className)}
    >
      {filled.map((group, index) => (
        <div
          key={index}
          className={classNames(
            'flex flex-col p-1',
            MENU_SURFACE,
            // Large corners on the menu's outside, extra-small where groups
            // meet, like a segmented list.
            index > 0 && 'rounded-t-extra-small',
            index < filled.length - 1 && 'rounded-b-extra-small'
          )}
        >
          {group}
        </div>
      ))}
    </div>
  );
}

/** Starts a new group: in a MenuList, the menu splits into separate
    surfaces here. */
export function MenuDivider() {
  return null;
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
  /** The current choice: a tertiary-container pill. */
  selected?: boolean;
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
  const { children, icon, trailing, destructive, selected, className, style } =
    props;
  const disabled = !!props.disabled;

  const classes = classNames(
    'flex items-center gap-3 w-full h-11 px-3 rounded-medium text-left font-plain text-label-large whitespace-nowrap',
    'state-layer-flat outline-none focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-secondary focus-visible:-outline-offset-3',
    // Stronger than the standard 8%/10%: on the menu's high surface those
    // barely show.
    '[--md-sys-state-hover-state-layer-opacity:0.14] [--md-sys-state-focus-state-layer-opacity:0.16]',
    disabled
      ? 'text-on-surface/38 cursor-default'
      : destructive
        ? 'text-error'
        : selected
          ? 'bg-tertiary-container text-on-tertiary-container'
          : 'text-on-surface',
    className
  );

  const content = (
    <>
      {icon && (
        <span
          className={classNames(
            'w-6 h-6 shrink-0 flex-center [&>svg]:w-6 [&>svg]:h-6',
            !disabled && !destructive && !selected && 'text-on-surface-variant'
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
            !disabled && !destructive && !selected && 'text-on-surface-variant'
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
        data-menu-item
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
        data-menu-item
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
      data-menu-item
    >
      {content}
    </button>
  );
}
