import { ADD_ROLES } from '../utils/constants';
import CreateRoleDialog from '../dialogs/CreateRoleDialog';
import QuickAdd from './QuickAdd';
import RoleCard from './RoleCard';
import SectionTitle from './SectionTitle';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { Role } from '../types';

type RolesProps = {
  roles?: Role[];
};

// The team's roles as a segmented list; members who can add roles get a
// New role extended FAB.
export default function Roles({ roles }: RolesProps) {
  // Non-null: RolesIndexPage renders inside Content, which renders nothing
  // until the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <section>
      <SectionTitle title="Roles" />
      <div className="list-segmented">
        {roles?.map(role => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>
      {currentMember.can(ADD_ROLES) && (
        <>
          <QuickAdd onAdd={() => setShowCreateDialog(true)} label="New role" />
          <CreateRoleDialog
            open={showCreateDialog}
            onCloseDialog={() => setShowCreateDialog(false)}
          />
        </>
      )}
    </section>
  );
}
