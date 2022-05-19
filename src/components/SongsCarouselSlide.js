import { useCallback, useState } from "react";

import Roadmap from "./Roadmap";
import _ from "lodash";
import { html } from "../utils/SongUtils";

export default function SongsCarouselSlide({
  song,
  onDisableSwipe,
  onEnableSwipe,
  onSongUpdate,
}) {
  const [roadmap, setRoadmap] = useState(() => song.roadmap);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce((field, updatedValue) => {
      onSongUpdate(field, updatedValue);
    }, 200),
    [onSongUpdate]
  );

  function handleRoadmapUpdate(field, updatedRoadmap) {
    setRoadmap(updatedRoadmap);
    debounce("roadmap", updatedRoadmap);
  }

  return (
    <div key={song?.id} className="mb-4 block">
      <Roadmap
        song={{ id: song.id, roadmap: roadmap }}
        onSongChange={handleRoadmapUpdate}
        onDragEnd={onEnableSwipe}
        onDragStart={onDisableSwipe}
      />
      <div className="relative w-full">
        <div id="song" className="mr-0 pb-24">
          {html(song)}
        </div>
      </div>
    </div>
  );
}
