import React from "react";
import Checkbox from "./Checkbox";

export default function AppleMusicTrackResult({ track, selected, onClick }) {
  function getArtworkUrl() {
    let url = track?.attributes?.artwork?.url;

    url = url.replace("{w}", 100);
    url = url.replace("{h}", 100);

    return url;
  }

  function handleClick(newToggleValue) {
    let artworkUrl = track?.attributes?.artwork?.url;

    artworkUrl = artworkUrl.replace("{w}", 400);
    artworkUrl = artworkUrl.replace("{h}", 400);
    onClick(
      {
        source: "Apple Music",
        external_id: track.id,
        url: track.attributes?.url,
        artwork_url: artworkUrl,
        name: track.attributes?.name,
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
        className={`flex w-full text-left items-center outline-none focus:outline-none `}
        onClick={() => handleClick(!selected)}
      >
        <img
          src={getArtworkUrl()}
          alt={`${track?.attributes?.name} Album Artwork`}
          className="w-16 h-16 rounded-md shadow-md"
        />
        <div className="ml-4">
          <div className="font-semibold text-lg leading-tight">
            {track?.attributes?.name}
          </div>
          <div className="text-gray-600 dark:text-dark-gray-200">
            {track?.attributes?.artistName}
          </div>
        </div>
      </button>
    </div>
  );
}
