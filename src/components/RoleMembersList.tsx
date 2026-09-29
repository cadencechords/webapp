import { ASSIGN_ROLES } from '../utils/constants';
import AddMembersToRoleDialog from '../dialogs/AddMembersToRoleDialog';
import Button from './Button';
import Icon from './Icon';
import NoDataMessage from './NoDataMessage';
import SectionTitle from './SectionTitle';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import RoleMemberRow from './RoleMemberRow';
import type { Membership, Role } from '../types';

type RoleMembersListProps = {
  /** RoleDetailPage's copy of the role, `{}` until it loads. */
  role: Partial<Role>;
  members?: Membership[];
};

/** Who's in the role, as a segmented list, with a tonal Add members button
    beside the title for members who can assign roles. */
export default function RoleMembersList({
  role,
  members,
}: RoleMembersListProps) {
  // Non-null: RoleDetailPage renders inside Content, which renders nothing
  // until the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;
  const [showAddMembersDialog, setShowAddMembersDialog] = useState(false);

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <SectionTitle title="Members" />
        {currentMember.can(ASSIGN_ROLES) && (
          <Button
            variant="accent"
            color="gray"
            size="sm"
            className="flex-center gap-2 shrink-0"
            onClick={() => setShowAddMembersDialog(true)}
          >
            <Icon name="person_add" className="w-5 h-5" />
            Add members
          </Button>
        )}
      </div>
      {members && members.length > 0 ? (
        <div className="list-segmented">
          {members.map(member => (
            <RoleMemberRow key={member.id} member={member} role={role} />
          ))}
        </div>
      ) : (
        <NoDataMessage compact>
          There are no members in this role yet
        </NoDataMessage>
      )}
      <AddMembersToRoleDialog
        open={showAddMembersDialog}
        onCloseDialog={() => setShowAddMembersDialog(false)}
        membersInRole={members}
      />
    </section>
  );
}
