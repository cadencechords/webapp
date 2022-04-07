import TrashIcon from "@heroicons/react/outline/TrashIcon";
import PlayIcon from "@heroicons/react/solid/PlayIcon";
import React from "react";
import MobileMenuButton from "./buttons/MobileMenuButton";
import StyledPopover from "./StyledPopover";

export default function TrackOptionsPopover({ track, button, onDelete }) {
  return (
    <StyledPopover button={button} position="top">
      <div className="rounded-lg shadow-xl bg-white dark:bg-dark-gray-700 w-60 flex flex-col">
        <MobileMenuButton
          full
          className="text-left dark:border-dark-gray-400 border-gray-300 border-b last:border-0 first:rounded-t-lg last:rounded-b-lg"
          color="black"
        >
          <a
            className="flex items-center"
            href={track.url}
            target="_blank"
            rel="noreferrer"
          >
            <PlayIcon className="w-4 h-4 mr-4" /> Listen on {track.source}
          </a>
        </MobileMenuButton>
        <MobileMenuButton
          full
          className="text-left first:rounded-t-lg last:rounded-b-lg"
          color="red"
          onClick={onDelete}
        >
          <div className="flex items-center">
            <TrashIcon className="w-4 h-4 mr-4" /> Delete
          </div>
        </MobileMenuButton>
      </div>
    </StyledPopover>
  );
}
