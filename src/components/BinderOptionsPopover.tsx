import { useHistory, useParams } from 'react-router-dom';

import BinderApi from '../api/BinderApi';
import Button from './Button';
import ConfirmDeleteDialog from '../dialogs/ConfirmDeleteDialog';
import { MenuDivider, MenuItem, MenuList } from './Menu';
import StyledPopover from './StyledPopover';
import { reportError } from '../utils/error';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentMember } from '../store/authSlice';
import { DELETE_BINDERS } from '../utils/constants';
import Icon from './Icon';

type BinderOptionsPopoverProps = {
  onChangeColorClick: () => void;
};

export default function BinderOptionsPopover({
  onChangeColorClick,
}: BinderOptionsPopoverProps) {
  // Non-null: kept as before, this throws if the membership hasn't loaded.
  const currentMember = useSelector(selectCurrentMember)!;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useHistory();
  // The route's path declares :id, which useParams can't see.
  const id = useParams<{ id: string }>().id;

  const button = (
    <Button variant="icon" color="gray" size="md">
      <Icon name="more_vert" className="w-5 h-5" />
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
        <MenuList className="w-60">
          <MenuItem onClick={onChangeColorClick} icon={<Icon name="palette" />}>
            Change color
          </MenuItem>
          {currentMember.can(DELETE_BINDERS) && (
            <>
              <MenuDivider />
              <MenuItem
                destructive
                onClick={() => setShowDeleteDialog(true)}
                icon={<Icon name="delete" />}
              >
                Delete
              </MenuItem>
            </>
          )}
        </MenuList>
      </StyledPopover>
    </>
  );
}
