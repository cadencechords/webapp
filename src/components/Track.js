import React from "react";
import TrackOptionsPopover from "./TrackOptionsPopover";
import AppleMusicIcon from "../images/apple_music_icon.png";
import SpotifyIcon from "../images/spotify_icon.png";
import YouTubeIcon from "../images/youtube_icon.png";
import TracksApi from "../api/tracksApi";

export default function Track({ songId, track, onDeleted }) {
  function handleDelete() {
    onDeleted(track.id);
    TracksApi.deleteOne(songId, track.id);
  }

  function getIcon() {
    if (track.source === "Apple Music") {
      return (
        <img
          src={AppleMusicIcon}
          width={25}
          height={25}
          alt="Icon"
          className="absolute top-1 right-1"
        />
      );
    } else if (track.source === "Spotify") {
      return (
        <img
          src={SpotifyIcon}
          width={25}
          height={25}
          alt="Icon"
          className="absolute top-1 right-1"
        />
      );
    } else if (track.source === "YouTube") {
      return (
        <img
          src={YouTubeIcon}
          width={25}
          height={18}
          alt="Icon"
          className="absolute top-1 right-1"
        />
      );
    }
  }
  const button = (
    <div className="mx-2 my-1 text-left outline-none focus:outline-none flex-shrink-0 relative">
      <img
        src={track.artwork_url}
        alt="Artwork"
        className="h-32 w-32 rounded-md shadow-lg"
      />
      <div className="w-32 whitespace-pre-wrap leading-tight mt-2">
        {track.name}
      </div>
      {getIcon()}
    </div>
  );
  return (
    <TrackOptionsPopover
      button={button}
      track={track}
      onDelete={handleDelete}
    />
  );
}
