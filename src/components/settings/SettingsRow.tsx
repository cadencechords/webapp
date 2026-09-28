import classNames from 'classnames';
import type { ReactNode } from 'react';
import Icon from '../Icon';
import type { OutlinedIconName } from '../icons/registry';
import { LIST_ITEM_TWO_LINE, LIST_SUPPORTING_TEXT } from '../lists/listItem';

type SettingsRowTextProps = {
  /** The leading icon, on a tonal rounded square. */
  icon?: OutlinedIconName;
  /** A 40px leading image in the icon's place, like a service's logo. */
  leading?: ReactNode;
  title: string;
  description: ReactNode;
  /** Shown in the error color: an action like logging out. */
  destructive?: boolean;
};

/** A settings row's leading icon (a rounded square on a tonal container)
    or image, headline and supporting text, as on the account menu. */
export function SettingsRowText({
  icon,
  leading,
  title,
  description,
  destructive,
}: SettingsRowTextProps) {
  return (
    <>
      {leading ?? (
        <span
          className={classNames(
            'flex-center w-10 h-10 shrink-0 rounded-[12px]',
            destructive
              ? 'bg-error-container text-on-error-container'
              : 'bg-secondary-container text-on-secondary-container'
          )}
        >
          {icon && <Icon name={icon} className="w-6 h-6" />}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div
          className={classNames(
            'text-title-medium',
            destructive && 'text-error'
          )}
        >
          {title}
        </div>
        <div className={LIST_SUPPORTING_TEXT}>{description}</div>
      </div>
    </>
  );
}

/** A two-line settings row that isn't clickable itself. */
export function SettingsRow({ children }: { children: ReactNode }) {
  return <div className={LIST_ITEM_TWO_LINE}>{children}</div>;
}
