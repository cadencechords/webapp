import React from 'react';
import StyledPopover from './StyledPopover';
import Button from './Button';
import AddStickyNoteIcon from '../icons/AddStickyNoteIcon';
import { MenuItem, MenuList } from './Menu';
import usePerformanceMode from '../hooks/usePerformanceMode';
import Icon from './Icon';

type MarkupPopoverProps = {
  onAddNote: () => void;
  onShowMarkingsModal: () => void;
};

export default function MarkupPopover({
  onAddNote,
  onShowMarkingsModal,
}: MarkupPopoverProps) {
  const { beginAnnotating } = usePerformanceMode();

  return (
    <StyledPopover
      position="bottom-end"
      button={
        <Button variant="icon" size="md" color="gray">
          <AddStickyNoteIcon className="w-6 h-6" />
        </Button>
      }
    >
      <MenuList className="w-60">
        <MenuItem onClick={onAddNote} icon={<AddStickyNoteIcon />}>
          Sticky note
        </MenuItem>
        <MenuItem
          onClick={onShowMarkingsModal}
          icon={
            <span
              style={{ fontFamily: 'Times New Roman' }}
              className="text-2xl italic font-bold leading-none"
            >
              f
            </span>
          }
        >
          Marking
        </MenuItem>
        <MenuItem onClick={beginAnnotating} icon={<Icon name="edit" filled />}>
          Annotate
        </MenuItem>
      </MenuList>
    </StyledPopover>
  );
}
