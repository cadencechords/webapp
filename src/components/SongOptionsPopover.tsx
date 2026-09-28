import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

import Button from './Button';
import ConfirmDeleteDialog from '../dialogs/ConfirmDeleteDialog';
import { DELETE_SONGS } from '../utils/constants';
import { MenuDivider, MenuItem, MenuList } from './Menu';
import StyledPopover from './StyledPopover';
import { selectCurrentMember } from '../store/authSlice';
import { useState } from 'react';
import useDeleteSong from '../hooks/api/useDeleteSong';
import Icon from './Icon';

type SongOptionsPopoverProps = {
  onPrintClick: () => void;
};

export default function SongOptionsPopover({
  onPrintClick,
}: SongOptionsPopoverProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useHistory();
  // The route's path declares :id, which useParams can't see.
  const id = parseInt(useParams<{ id: string }>().id);
  // Non-null: Content renders the pages only once the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;

  const { run: deleteSong } = useDeleteSong({
    onSuccess: () => router.goBack(),
  });

  const button = (
    <Button variant="icon" color="gray" size="md">
      <Icon name="more_vert" className="w-6 h-6" />
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
        <MenuList className="w-60">
          <MenuItem onClick={onPrintClick} icon={<Icon name="print" />}>
            Print
          </MenuItem>
          {currentMember.can(DELETE_SONGS) && (
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
