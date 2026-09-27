import { DELETE_FILES, EDIT_FILES } from '../utils/constants';

import Button from './Button';
import { MenuDivider, MenuItem, MenuList } from './Menu';
import StyledPopover from './StyledPopover';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import Icon from './Icon';
import type { SongFile } from '../types';

type SongFileOptionsPopoverProps = {
  onDelete: () => void;
  onEdit: () => void;
  file: SongFile;
};

export default function SongFileOptionsPopover({
  onDelete,
  onEdit,
  file,
}: SongFileOptionsPopoverProps) {
  // Non-null: Content renders the pages only once the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;

  const button = (
    <Button variant="icon" color="gray">
      <Icon name="more_vert" className="w-4 h-4" />
    </Button>
  );
  return (
    <StyledPopover button={button}>
      <MenuList className="w-60">
        <MenuItem href={file.url} icon={<Icon name="download" />}>
          Download
        </MenuItem>
        {currentMember.can(EDIT_FILES) && (
          <MenuItem onClick={onEdit} icon={<Icon name="edit" />}>
            Edit
          </MenuItem>
        )}
        {currentMember.can(DELETE_FILES) && (
          <>
            <MenuDivider />
            <MenuItem
              destructive
              onClick={onDelete}
              icon={<Icon name="delete" />}
            >
              Delete
            </MenuItem>
          </>
        )}
      </MenuList>
    </StyledPopover>
  );
}
