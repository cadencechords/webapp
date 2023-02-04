import { DELETE_FILES, EDIT_FILES } from '../utils/constants';

import Button from './Button';
import DotsVerticalIcon from '@heroicons/react/outline/DotsVerticalIcon';
import DownloadIcon from '@heroicons/react/outline/DownloadIcon';
import MobileMenuButton from './buttons/MobileMenuButton';
import PencilIcon from '@heroicons/react/outline/PencilIcon';
import StyledPopover from './StyledPopover';
import TrashIcon from '@heroicons/react/outline/TrashIcon';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';

export default function SongFileOptionsPopover({ onDelete, onEdit, file }) {
  const currentMember = useSelector(selectCurrentMember);

  const button = (
    <Button variant="icon" color="gray">
      <DotsVerticalIcon className="w-4 h-4" />
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
            <DownloadIcon className="w-4 h-4" />
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
            <PencilIcon className="w-4 h-4" />
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
            <TrashIcon className="w-4 h-4" />
          </MobileMenuButton>
        )}
      </div>
    </StyledPopover>
  );
}
