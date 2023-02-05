import React from 'react';
import Button from './Button';
import TrashIcon from '@heroicons/react/outline/TrashIcon';
import { useSelector } from 'react-redux';
import { selectCurrentMember } from '../store/authSlice';
import { ASSIGN_ROLES } from '../utils/constants';
import useRemoveMemberFromRole from '../hooks/api/useRemoveMemberFromRole';

export default function RoleMemberRow({ role, member }) {
  const currentMember = useSelector(selectCurrentMember);
  const { run: removeMemberFromRole } = useRemoveMemberFromRole();

  return (
    <div className="flex items-center justify-between h-12 px-3 py-2 border-b sm:h-10 dark:border-dark-gray-600 last:border-0 sm:rounded-lg sm:hover:bg-gray-100 dark:hover:bg-dark-gray-800 sm:border-0">
      <div className="inline-block overflow-hidden whitespace-nowrap overflow-ellipsis">
        {member.user.email}
      </div>
      {currentMember.can(ASSIGN_ROLES) && role?.name !== 'Member' && (
        <Button
          variant="icon"
          color="gray"
          onClick={() =>
            removeMemberFromRole({ memberId: member.id, roleId: role.id })
          }
          loading={false}
          size="md"
          className="whitespace-nowrap"
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
