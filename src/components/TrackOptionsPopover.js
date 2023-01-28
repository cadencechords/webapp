import TrashIcon from '@heroicons/react/outline/TrashIcon';
import PlayIcon from '@heroicons/react/solid/PlayIcon';
import React from 'react';
import MobileMenuButton from './buttons/MobileMenuButton';
import StyledPopover from './StyledPopover';

export default function TrackOptionsPopover({ track, button, onDelete }) {
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
            <PlayIcon className="w-4 h-4" />
          </MobileMenuButton>
        </a>
        <MobileMenuButton
          full
          className="border-b dark:border-dark-gray-400 last:border-0 flex-between"
          color="red"
          onClick={onDelete}
        >
          Delete
          <TrashIcon className="w-4 h-4" />
        </MobileMenuButton>
      </div>
    </StyledPopover>
  );
}
