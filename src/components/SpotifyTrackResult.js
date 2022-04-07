import React from "react";
import Checkbox from "./Checkbox";

export default function SpotifyTrackResult({ track, selected, onClick }) {
  function getArtworkUrl() {
    return track?.album?.images?.[0]?.url;
  }

  function getArtists() {
    return track?.artists?.map((artist) => artist.name)?.join(", ");
  }

  function handleClick(newToggleValue) {
    onClick(
      {
        source: "Spotify",
        external_id: track.id,
        url: track.external_urls?.spotify,
        artwork_url: getArtworkUrl(),
        name: track.name,
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
          alt={`${track.name} Album Artwork`}
          className="w-16 h-16 rounded-md shadow-md"
        />
        <div className="ml-4">
          <div className="font-semibold text-lg leading-tight">
            {track.name}
          </div>
          <div className="text-gray-600 dark:text-dark-gray-200">
            {getArtists()}
          </div>
        </div>
      </button>
    </div>
  );
}
