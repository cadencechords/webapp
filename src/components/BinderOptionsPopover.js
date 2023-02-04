import { useHistory, useParams } from 'react-router-dom';

import BinderApi from '../api/BinderApi';
import Button from './Button';
import ConfirmDeleteDialog from '../dialogs/ConfirmDeleteDialog';
import DotsVerticalIcon from '@heroicons/react/outline/DotsVerticalIcon';
import MobileMenuButton from './buttons/MobileMenuButton';
import StyledPopover from './StyledPopover';
import TrashIcon from '@heroicons/react/outline/TrashIcon';
import { reportError } from '../utils/error';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentMember } from '../store/authSlice';
import { DELETE_BINDERS } from '../utils/constants';

export default function BinderOptionsPopover({ onChangeColorClick }) {
  const currentMember = useSelector(selectCurrentMember);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useHistory();
  const id = useParams().id;

  let button = (
    <Button variant="icon" color="gray" size="md">
      <DotsVerticalIcon className="w-5 h-5" />
    </Button>
  );

  const handleDelete = async () => {
    try {
      await BinderApi.deleteOneById(id);
      router.push('/binders');
    } catch (error) {
      reportError(error);
    }
  };

  return (
    <>
      <ConfirmDeleteDialog
        show={showDeleteDialog}
        onCloseDialog={() => setShowDeleteDialog(false)}
        onCancel={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      >
        Deleting this binder will NOT delete any songs in the binder. Deleting
        is irreversible.
      </ConfirmDeleteDialog>
      <StyledPopover button={button} position="bottom-start">
        <div className="overflow-hidden rounded-lg w-60">
          <MobileMenuButton
            full
            color="black"
            className="flex items-center border-b last:border-0 dark:border-dark-gray-400"
            onClick={onChangeColorClick}
          >
            Change color
          </MobileMenuButton>
          {currentMember.can(DELETE_BINDERS) && (
            <MobileMenuButton
              full
              color="red"
              className="border-b last:border-0 flex-between dark:border-dark-gray-400"
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
