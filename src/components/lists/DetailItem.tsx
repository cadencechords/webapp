import type { ReactNode } from 'react';
import Icon from '../Icon';
import type { OutlinedIconName } from '../icons/registry';
import { LIST_ITEM_TWO_LINE, LIST_SUPPORTING_TEXT } from './listItem';

type DetailItemProps = {
  icon: OutlinedIconName;
  label: string;
  children: ReactNode;
};

/** A two-line list item for a list-segmented container: the detail's label
    over its value, after an icon. */
export default function DetailItem({ icon, label, children }: DetailItemProps) {
  return (
    <div className={LIST_ITEM_TWO_LINE}>
      <Icon name={icon} className="w-6 h-6 shrink-0 text-on-surface-variant" />
      <div className="flex-1 min-w-0">
        <div className={LIST_SUPPORTING_TEXT}>{label}</div>
        <div className="truncate">{children}</div>
      </div>
    </div>
  );
}
