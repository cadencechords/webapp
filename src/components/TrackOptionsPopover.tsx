import React, { type ReactNode } from 'react';
import { MenuDivider, MenuItem, MenuList } from './Menu';
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
      <MenuList className="w-60">
        {/* A track without a url has nowhere to open: shown disabled. */}
        <MenuItem
          {...(track.url ? { href: track.url } : { disabled: true })}
          icon={<Icon name="play_circle" filled />}
        >
          Listen on {track.source}
        </MenuItem>
        <MenuDivider />
        <MenuItem destructive onClick={onDelete} icon={<Icon name="delete" />}>
          Delete
        </MenuItem>
      </MenuList>
    </StyledPopover>
  );
}
