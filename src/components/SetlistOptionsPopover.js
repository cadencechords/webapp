import React from 'react';
import StyledPopover from './StyledPopover';
import Button from './Button';
import DotsVerticalIcon from '@heroicons/react/outline/DotsVerticalIcon';
import MobileMenuButton from './buttons/MobileMenuButton';
import useDialog from '../hooks/useDialog';
import TrashIcon from '@heroicons/react/outline/TrashIcon';
import ConfirmDeleteDialog from '../dialogs/ConfirmDeleteDialog';
import useDeleteSetlist from '../hooks/api/useDeleteSetlist';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentMember } from '../store/authSlice';
import { DELETE_SETLISTS } from '../utils/constants';
import classNames from 'classnames';

export default function SetlistOptionsPopover({ setlist, onPerform }) {
  const [isConfirmationOpen, showConfirmation, hideConfirmation] = useDialog();
  const { run: deleteSetlist } = useDeleteSetlist({
    onSuccess: () => router.replace('/sets'),
  });
  const router = useHistory();
  const currentMember = useSelector(selectCurrentMember);

  if (!currentMember.can(DELETE_SETLISTS) && !setlist.songs.length) return null;

  return (
    <>
      <StyledPopover
        position="bottom-start"
        button={
          <Button size="xs" variant="open" color="gray">
            <DotsVerticalIcon className="w-5 h-5 text-gray-500" />
          </Button>
        }
      >
        <div className="overflow-hidden rounded-lg w-60">
          {setlist.songs?.length && (
            <MobileMenuButton
              full
              color="gray"
              className="flex items-center"
              onClick={onPerform}
            >
              Perform
            </MobileMenuButton>
          )}
          {currentMember.can(DELETE_SETLISTS) && (
            <MobileMenuButton
              full
              color="red"
              className={classNames(
                'flex-between dark:border-dark-gray-400',
                setlist.songs?.length && 'border-t'
              )}
              onClick={showConfirmation}
            >
              Delete
              <TrashIcon className="w-5 h-5" />
            </MobileMenuButton>
          )}
        </div>
      </StyledPopover>
      <ConfirmDeleteDialog
        show={isConfirmationOpen}
        onCloseDialog={hideConfirmation}
        onCancel={hideConfirmation}
        onConfirm={() => deleteSetlist(setlist.id)}
      >
        Deleting this set is irreversible.
      </ConfirmDeleteDialog>
    </>
  );
}
