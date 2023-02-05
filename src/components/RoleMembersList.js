import { ASSIGN_ROLES } from '../utils/constants';
import AddMembersToRoleDialog from '../dialogs/AddMembersToRoleDialog';
import Button from './Button';
import NoDataMessage from './NoDataMessage';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import List from './List';
import RoleMemberRow from './RoleMemberRow';

export default function RoleMembersList({ role, members }) {
  const currentMember = useSelector(selectCurrentMember);
  const [showAddMembersDialog, setShowAddMembersDialog] = useState(false);

  return (
    <div className="mb-4">
      <div className="pt-3 mt-8 mb-3 text-lg font-semibold border-t flex-between dark:border-dark-gray-600">
        <div>Who's in this group </div>
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
