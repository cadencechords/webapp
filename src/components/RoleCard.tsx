import { Link } from 'react-router-dom';
import Icon from './Icon';
import { SettingsRowText } from './settings/SettingsRow';
import { LIST_ITEM_INTERACTIVE, LIST_ITEM_TWO_LINE } from './lists/listItem';
import type { Role } from '../types';

type RoleCardProps = {
  role: Role;
};

/** A role as a two-line row in a segmented list, opening the role. */
export default function RoleCard({ role }: RoleCardProps) {
  const count = role.memberships?.length ?? 0;
  return (
    <Link
      to={`/permissions/${role.id}`}
      className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE}`}
    >
      <SettingsRowText
        icon="manage_accounts"
        title={role.name}
        description={`${count} member${count !== 1 ? 's' : ''}`}
      />
      <Icon
        name="chevron_right"
        className="w-6 h-6 shrink-0 text-on-surface-variant"
      />
    </Link>
  );
}
