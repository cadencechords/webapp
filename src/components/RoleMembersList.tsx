import { ASSIGN_ROLES } from '../utils/constants';
import AddMembersToRoleDialog from '../dialogs/AddMembersToRoleDialog';
import Button from './Button';
import NoDataMessage from './NoDataMessage';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import List from './List';
import RoleMemberRow from './RoleMemberRow';
import type { Membership, Role } from '../types';

type RoleMembersListProps = {
  /** RoleDetailPage's copy of the role, `{}` until it loads. */
  role: Partial<Role>;
  members?: Membership[];
};

export default function RoleMembersList({
  role,
  members,
}: RoleMembersListProps) {
  // Non-null: RoleDetailPage renders inside Content, which renders nothing
  // until the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;
  const [showAddMembersDialog, setShowAddMembersDialog] = useState(false);

  return (
    <div className="mb-4">
      <div className="pt-3 mt-8 mb-3 text-lg font-semibold border-t flex-between dark:border-dark-gray-600">
        <div>Who&apos;s in this group </div>
        {currentMember.can(ASSIGN_ROLES) && (
          <Button variant="open" onClick={() => setShowAddMembersDialog(true)}>
            Add members
          </Button>
        )}
      </div>
      <List
        data={members}
        renderItem={member => (
          <RoleMemberRow key={member.id} member={member} role={role} />
        )}
        ListEmpty={
          <NoDataMessage>There are no members in this role yet</NoDataMessage>
        }
      />
      <AddMembersToRoleDialog
        open={showAddMembersDialog}
        onCloseDialog={() => setShowAddMembersDialog(false)}
        membersInRole={members}
      />
    </div>
  );
}
