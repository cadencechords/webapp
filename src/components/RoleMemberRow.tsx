import Button from './Button';
import { useSelector } from 'react-redux';
import { selectCurrentMember } from '../store/authSlice';
import { ASSIGN_ROLES } from '../utils/constants';
import useRemoveMemberFromRole from '../hooks/api/useRemoveMemberFromRole';
import Icon from './Icon';
import ProfilePicture from './ProfilePicture';
import { LIST_ITEM_TWO_LINE, LIST_SUPPORTING_TEXT } from './lists/listItem';
import { getNameOrEmail, hasName } from '../utils/model';
import type { Membership, Role } from '../types';

type RoleMemberRowProps = {
  /** RoleDetailPage's copy of the role, `{}` until it loads. */
  role: Partial<Role>;
  member: Membership;
};

/** A member of the role as a two-line row (avatar, name and email), with a
    remove button for members who can assign roles. */
export default function RoleMemberRow({ role, member }: RoleMemberRowProps) {
  // Non-null: RoleDetailPage renders inside Content, which renders nothing
  // until the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;
  const { run: removeMemberFromRole } = useRemoveMemberFromRole();
  const canRemoveFromRole =
    currentMember.can(ASSIGN_ROLES) && role?.name !== 'Member';
  const named = hasName(member.user);

  return (
    <div className={LIST_ITEM_TWO_LINE}>
      <ProfilePicture
        url={member.user.image_url}
        name={getNameOrEmail(member.user)}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <div className="truncate">
          {named
            ? `${member.user.first_name} ${member.user.last_name}`
            : member.user.email}
        </div>
        {named && (
          <div className={`truncate ${LIST_SUPPORTING_TEXT}`}>
            {member.user.email}
          </div>
        )}
      </div>
      {canRemoveFromRole && (
        <Button
          variant="icon"
          color="gray"
          size="md"
          name={`Remove ${getNameOrEmail(member.user)} from this role`}
          className="shrink-0 -mr-2"
          onClick={() =>
            // Non-null: the rows list the loaded role's memberships, so the
            // role has its id.
            removeMemberFromRole({ memberId: member.id, roleId: role.id! })
          }
        >
          <Icon name="person_remove" className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
