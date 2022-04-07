import React, { useEffect, useState } from "react";
import { reportError } from "../utils/error";
import PageLoading from "./PageLoading";
import TracksApi from "../api/tracksApi";
import YouTubeTrackResult from "./YouTubeTrackResult";

export default function YouTubeSearchResults({
  query,
  onTrackClick,
  selectedTracks,
}) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => {
      async function search() {
        try {
          let { data } = await TracksApi.searchYoutube(query);
          setResults(data?.items || []);
        } catch (error) {
          reportError(error);
        } finally {
          setLoading(false);
        }
      }
      if (query) {
        search();
      }
    }, 800);

    return () => clearTimeout(id);
  }, [query]);

  function isSelected(resultInQuestion) {
    return !!selectedTracks.find(
      (selectedTrack) =>
        selectedTrack.external_id === resultInQuestion.id.videoId &&
        selectedTrack.source === "YouTube"
    );
  }

  return (
    <div className="my-4">
      {loading ? (
        <PageLoading />
      ) : (
        results.map((result) => (
          <YouTubeTrackResult
            track={result}
            key={result.id.videoId}
            onClick={onTrackClick}
            selected={isSelected(result)}
          />
        ))
      )}
    </div>
  );
}
