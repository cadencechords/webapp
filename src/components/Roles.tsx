import { ADD_ROLES } from '../utils/constants';
import Card from './Card';
import CreateRoleDialog from '../dialogs/CreateRoleDialog';
import RoleCard from './RoleCard';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Icon from './Icon';
import type { Role } from '../types';

type RolesProps = {
  roles?: Role[];
};

export default function Roles({ roles }: RolesProps) {
  // Non-null: RolesIndexPage renders inside Content, which renders nothing
  // until the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-4 my-4 sm:grid-cols-2 lg:grid-cols-3">
      {roles?.map(role => (
        <RoleCard key={role.id} role={role} />
      ))}
      {currentMember.can(ADD_ROLES) && (
        <>
          <Card
            onClick={() => setShowCreateDialog(true)}
            variant="outlined"
            className="text-center text-label-large text-on-surface-variant flex-center"
          >
            <Icon name="add_circle" className="w-4 h-4 mr-2" />
            New role
          </Card>
          <CreateRoleDialog
            open={showCreateDialog}
            onCloseDialog={() => setShowCreateDialog(false)}
          />
        </>
      )}
    </div>
  );
}
