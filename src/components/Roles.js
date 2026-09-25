import { ADD_ROLES } from '../utils/constants';
import Card from './Card';
import CreateRoleDialog from '../dialogs/CreateRoleDialog';
import RoleCard from './RoleCard';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Icon from './Icon';

export default function Roles({ roles }) {
  const currentMember = useSelector(selectCurrentMember);
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
            className="font-medium text-center text-gray-600 transition-colors cursor-pointer flex-center dark:text-dark-gray-200 hover:bg-gray-200 focus:bg-gray-200 dark:bg-dark-gray-800 dark:hover:bg-dark-gray-700 dark:focus:bg-dark-gray-700"
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
