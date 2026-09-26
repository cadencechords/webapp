import { DELETE_FILES, EDIT_FILES } from '../utils/constants';

import Button from './Button';
import MobileMenuButton from './buttons/MobileMenuButton';
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
      <div className="overflow-hidden rounded-lg w-60">
        <a
          href={file.url}
          target="_blank"
          rel="noreferrer"
          className="block border-b dark:border-dark-gray-400 last:border-0"
        >
          <MobileMenuButton full className="flex-between" color="black">
            Download
            <Icon name="download" className="w-4 h-4" />
          </MobileMenuButton>
        </a>
        {currentMember.can(EDIT_FILES) && (
          <MobileMenuButton
            full
            className="border-b dark:border-dark-gray-400 last:border-0 flex-between"
            color="black"
            onClick={onEdit}
          >
            Edit
            <Icon name="edit" className="w-4 h-4" />
          </MobileMenuButton>
        )}
        {currentMember.can(DELETE_FILES) && (
          <MobileMenuButton
            full
            className="border-b dark:border-dark-gray-400 last:border-0 flex-between"
            color="red"
            onClick={onDelete}
          >
            Delete
            <Icon name="delete" className="w-4 h-4" />
          </MobileMenuButton>
        )}
      </div>
    </StyledPopover>
  );
}
