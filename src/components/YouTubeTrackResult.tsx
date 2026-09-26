import React from 'react';
import Checkbox from './Checkbox';
import type { YouTubeVideo } from '../api/tracksApi';
import type { NewTrack } from '../types';

type YouTubeTrackResultProps = {
  track: YouTubeVideo;
  selected: boolean;
  onClick: (track: NewTrack, selected: boolean) => void;
};

export default function YouTubeTrackResult({
  track,
  selected,
  onClick,
}: YouTubeTrackResultProps) {
  function getThumbnailUrl() {
    return (
      track?.snippet?.thumbnails?.standard?.url ||
      track?.snippet?.thumbnails?.default?.url
    );
  }

  function handleClick(newToggleValue: boolean) {
    onClick(
      {
        source: 'YouTube',
        external_id: track.id?.videoId,
        url: `https://www.youtube.com/watch/${track.id?.videoId}`,
        artwork_url:
          track?.snippet?.thumbnails?.standard?.url ||
          track?.snippet?.thumbnails?.default?.url,
        name: track.snippet?.title,
      },
      newToggleValue
    );
  }

  return (
    <div
      className={
        `border-b last:border-0 transition-colors dark:border-dark-gray-700 hover:bg-gray-50 focus:bg-gray-50 dark:hover:bg-dark-gray-800 dark:focus:bg-dark-gray-800 ` +
        ` flex items-center p-2 `
      }
    >
      <Checkbox className="mr-4" checked={selected} onChange={handleClick} />
      <button
        className={`flex w-full text-left items-center outline-hidden focus:outline-hidden `}
        onClick={() => handleClick(!selected)}
      >
        <img
          src={getThumbnailUrl()}
          alt={`${track?.snippet?.title} Thumbnail`}
          className="w-16 h-16 rounded-md shadow-md"
        />
        <div className="ml-4">
          <div className="font-semibold text-lg leading-tight">
            {track?.snippet?.title}
          </div>
          <div className="text-gray-600 dark:text-dark-gray-200">
            {track?.snippet?.channelTitle}
          </div>
        </div>
      </button>
    </div>
  );
}
