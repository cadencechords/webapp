import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import Button from './Button';
import ConfirmDeleteDialog from '../dialogs/ConfirmDeleteDialog';
import { DELETE_SONGS } from '../utils/constants';
import DotsVerticalIcon from '@heroicons/react/outline/DotsVerticalIcon';
import MobileMenuButton from './buttons/MobileMenuButton';
import PrinterIcon from '@heroicons/react/outline/PrinterIcon';
import StyledPopover from './StyledPopover';
import TrashIcon from '@heroicons/react/outline/TrashIcon';
import { selectCurrentMember } from '../store/authSlice';
import { useState } from 'react';
import useDeleteSong from '../hooks/api/useDeleteSong';

export default function SongOptionsPopover({ onPrintClick }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useHistory();
  const id = parseInt(useParams().id);
  const currentMember = useSelector(selectCurrentMember);

  const { run: deleteSong } = useDeleteSong({
    onSuccess: () => router.goBack(),
  });

  let button = (
    <Button variant="icon" color="gray" size="md">
      <DotsVerticalIcon className="w-5 h-5" />
    </Button>
  );

  const handleDelete = async () => {
    deleteSong(id);
  };

  return (
    <>
      <ConfirmDeleteDialog
        show={showDeleteDialog}
        onCloseDialog={() => setShowDeleteDialog(false)}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
      <StyledPopover button={button} position="bottom-end">
        <div className="overflow-hidden rounded-lg w-60">
          <MobileMenuButton
            onClick={onPrintClick}
            full
            color="black"
            className="border-b flex-between last:border-0 dark:border-dark-gray-400"
          >
            Print
            <PrinterIcon className="w-5 h-5" />
          </MobileMenuButton>
          {currentMember.can(DELETE_SONGS) && (
            <MobileMenuButton
              full
              color="red"
              className="border-b flex-between last:border-0 dark:border-dark-gray-400"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
              <TrashIcon className="w-5 h-5" />
            </MobileMenuButton>
          )}
        </div>
      </StyledPopover>
    </>
  );
}
