import { ASSIGN_ROLES } from '../utils/constants';
import MenuSelect from '../components/MenuSelect';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import useAssignRoleToMember from '../hooks/api/useAssignRoleToMember';
import {
  LIST_ITEM_TWO_LINE,
  LIST_SUPPORTING_TEXT,
} from '../components/lists/listItem';
import ProfilePicture from '../components/ProfilePicture';
import SectionTitle from '../components/SectionTitle';
import { getNameOrEmail, hasName } from '../utils/model';
import type { Membership, Role } from '../types';

type MemberRolesTableProps = {
  roles?: Role[];
  members: Membership[];
  /** Not called; the role is saved through useAssignRoleToMember. */
  onRoleAssigned?: () => void;
};

export default function MemberRolesTable({
  roles,
  members,
  onRoleAssigned,
}: MemberRolesTableProps) {
  const roleOptions = roles?.map(role => ({
    value: role.name,
    display: role.name,
  }));
  const currentMember = useSelector(selectCurrentMember);

  const { run: assignRoleToMember } = useAssignRoleToMember();

  // Each member as a two-line row (avatar, name and email), with their role
  // at the end: a dropdown for members who can assign roles.
  return (
    <section>
      <SectionTitle title="Members" />
      <div className="list-segmented">
        {members.map(member => (
          <div key={member.id} className={LIST_ITEM_TWO_LINE}>
            <ProfilePicture
              url={member.user.image_url}
              name={getNameOrEmail(member.user)}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <div className="truncate">
                {hasName(member.user)
                  ? `${member.user.first_name} ${member.user.last_name}`
                  : member.user.email}
              </div>
              {hasName(member.user) && (
                <div className={`truncate ${LIST_SUPPORTING_TEXT}`}>
                  {member.user.email}
                </div>
              )}
            </div>
            {/* Non-null: kept as before, this throws if the membership hasn't loaded. */}
            {currentMember!.can(ASSIGN_ROLES) ? (
              <div className="shrink-0">
                <MenuSelect
                  options={withOwnRole(roleOptions ?? [], member.role.name)}
                  selected={member.role.name}
                  onChange={roleName =>
                    assignRoleToMember({ memberId: member.id, roleName })
                  }
                  menuClassName="w-48"
                />
              </div>
            ) : (
              <span className="shrink-0 inline-flex items-center h-8 px-3 rounded-small bg-surface-container-highest text-label-large text-on-surface-variant">
                {member.role.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/** The roles, plus the member's own when it isn't among them (a role just
    deleted, before the members refetch), so their button still names it. */
function withOwnRole(
  options: { value: string; display: string }[],
  ownRole: string
) {
  return options.some(option => option.value === ownRole)
    ? options
    : [...options, { value: ownRole, display: ownRole }];
}
