import React from 'react';
import StyledPopover from './StyledPopover';
import Button from './Button';
import AddStickyNoteIcon from '../icons/AddStickyNoteIcon';
import MobileMenuButton from './buttons/MobileMenuButton';

export default function MarkupPopover({ onAddNote }) {
  return (
    <StyledPopover
      position="bottom-end"
      button={
        <Button variant="icon" size="md" color="gray">
          <AddStickyNoteIcon className="w-6 h-6" />
        </Button>
      }
    >
      <div className="overflow-hidden rounded-lg w-60">
        <MobileMenuButton
          full
          className="border-b h-11 flex-between dark:border-dark-gray-400"
          color="black"
          style={{ paddingTop: 0, paddingBottom: 0 }}
          onClick={onAddNote}
        >
          Sticky note
          <AddStickyNoteIcon className="w-5 h-5" />
        </MobileMenuButton>
        <MobileMenuButton
          full
          className="h-11 flex-between"
          color="black"
          style={{ paddingTop: 0, paddingBottom: 0 }}
        >
          Marking
          <span
            style={{ fontFamily: 'Times New Roman' }}
            className="w-5 text-xl italic font-bold text-center"
          >
            f
          </span>
        </MobileMenuButton>
      </div>
    </StyledPopover>
  );
}
