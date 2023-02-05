import { ASSIGN_ROLES } from '../utils/constants';
import StyledListBox from '../components/StyledListBox';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import useAssignRoleToMember from '../hooks/api/useAssignRoleToMember';

export default function MemberRolesTable({ roles, members, onRoleAssigned }) {
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
      <div>
        {members.map(member => (
          <div
            key={member.id}
            className="px-1 py-2 border-b dark:border-dark-gray-600 flex-between last:border-0"
          >
            {member.user.email}
            {currentMember.can(ASSIGN_ROLES) ? (
              <div className="w-44">
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
              <div className="font-medium">{member.role.name}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
