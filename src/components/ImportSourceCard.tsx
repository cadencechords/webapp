import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { SettingsRowText } from './settings/SettingsRow';
import { LIST_ITEM_INTERACTIVE, LIST_ITEM_TWO_LINE } from './lists/listItem';

type ImportSourceCardProps = {
  title: string;
  /** What importing from it does. */
  children?: ReactNode;
  /** The source's 40px logo. */
  image: ReactNode;
  to: string;
};

/** An import source as a two-line row in a segmented list: its logo, name
    and what it imports; the whole row opens the import. */
export default function ImportSourceCard({
  title,
  children,
  image,
  to,
}: ImportSourceCardProps) {
  return (
    <Link to={to} className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE}`}>
      <SettingsRowText leading={image} title={title} description={children} />
      <Icon
        name="chevron_right"
        className="w-6 h-6 shrink-0 text-on-surface-variant"
      />
    </Link>
  );
}
