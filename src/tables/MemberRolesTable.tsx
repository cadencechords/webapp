import { ASSIGN_ROLES } from '../utils/constants';
import StyledListBox from '../components/StyledListBox';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import useAssignRoleToMember from '../hooks/api/useAssignRoleToMember';
import { LIST_ITEM } from '../components/lists/listItem';
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
    template: role.name,
  }));
  const currentMember = useSelector(selectCurrentMember);

  const { run: assignRoleToMember } = useAssignRoleToMember();

  return (
    <>
      <div className="pt-3 mt-12 mb-3 text-lg font-semibold border-t flex-between dark:border-dark-gray-600">
        Members
      </div>
      <div className="list-segmented">
        {members.map(member => (
          <div key={member.id} className={`${LIST_ITEM} justify-between`}>
            <span className="min-w-0 truncate">{member.user.email}</span>
            {/* Non-null: kept as before, this throws if the membership hasn't loaded. */}
            {currentMember!.can(ASSIGN_ROLES) ? (
              <div className="w-44 shrink-0">
                <StyledListBox
                  options={roleOptions}
                  selectedOption={{
                    value: member.role.name,
                    template: member.role.name,
                  }}
                  onChange={option =>
                    assignRoleToMember({
                      memberId: member.id,
                      roleName: option,
                    })
                  }
                />
              </div>
            ) : (
              <div className="text-label-large text-on-surface-variant">
                {member.role.name}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
