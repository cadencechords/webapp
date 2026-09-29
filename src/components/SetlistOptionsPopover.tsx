import React from 'react';
import StyledPopover from './StyledPopover';
import Button from './Button';
import { MenuDivider, MenuItem, MenuList } from './Menu';
import useDialog from '../hooks/useDialog';
import ConfirmDeleteDialog from '../dialogs/ConfirmDeleteDialog';
import useDeleteSetlist from '../hooks/api/useDeleteSetlist';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentMember } from '../store/authSlice';
import { DELETE_SETLISTS } from '../utils/constants';
import Icon from './Icon';
import type { Setlist } from '../types';

type SetlistOptionsPopoverProps = {
  setlist: Setlist;
  onPerform: () => void;
};

export default function SetlistOptionsPopover({
  setlist,
  onPerform,
}: SetlistOptionsPopoverProps) {
  const [isConfirmationOpen, showConfirmation, hideConfirmation] = useDialog();
  const { run: deleteSetlist } = useDeleteSetlist({
    onSuccess: () => router.replace('/sets'),
  });
  const router = useHistory();
  // Non-null: kept as before, this throws if the membership hasn't loaded.
  const currentMember = useSelector(selectCurrentMember)!;

  // Non-null: kept as before; a set loaded by id comes with its songs.
  if (!currentMember.can(DELETE_SETLISTS) && !setlist.songs!.length)
    return null;

  const canPerform = !!setlist.songs && setlist.songs.length > 0;
  const canDelete = currentMember.can(DELETE_SETLISTS);

  return (
    <>
      <StyledPopover
        position="bottom-start"
        button={
          <Button variant="icon" color="gray" size="md">
            <Icon name="more_vert" className="w-6 h-6" />
          </Button>
        }
      >
        <MenuList className="w-60">
          {canPerform && (
            <MenuItem onClick={onPerform} icon={<Icon name="play_arrow" />}>
              Perform
            </MenuItem>
          )}
          {canPerform && canDelete && <MenuDivider />}
          {canDelete && (
            <MenuItem
              destructive
              onClick={showConfirmation}
              icon={<Icon name="delete" />}
            >
              Delete
            </MenuItem>
          )}
        </MenuList>
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
