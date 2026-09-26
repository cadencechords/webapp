import React, { type ReactNode } from 'react';
import MobileMenuButton from './buttons/MobileMenuButton';
import StyledPopover from './StyledPopover';
import Icon from './Icon';
import type { Track } from '../types';

type TrackOptionsPopoverProps = {
  track: Track;
  /** What opens the popover. */
  button: ReactNode;
  onDelete: () => void;
};

export default function TrackOptionsPopover({
  track,
  button,
  onDelete,
}: TrackOptionsPopoverProps) {
  return (
    <StyledPopover button={button} position="top">
      <div className="overflow-hidden rounded-lg w-60">
        <a
          className="block border-b dark:border-dark-gray-400 last:border-0"
          href={track.url}
          target="_blank"
          rel="noreferrer"
        >
          <MobileMenuButton full className="flex-between" color="black">
            Listen on {track.source}
            <Icon name="play_circle" filled className="w-4 h-4" />
          </MobileMenuButton>
        </a>
        <MobileMenuButton
          full
          className="border-b dark:border-dark-gray-400 last:border-0 flex-between"
          color="red"
          onClick={onDelete}
        >
          Delete
          <Icon name="delete" className="w-4 h-4" />
        </MobileMenuButton>
      </div>
    </StyledPopover>
  );
}
