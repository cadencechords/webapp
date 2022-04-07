import React, { useEffect, useState } from "react";
import { reportError } from "../utils/error";
import PageLoading from "./PageLoading";
import TracksApi from "../api/tracksApi";
import SpotifyTrackResult from "./SpotifyTrackResult";

export default function SpotifySearchResults({
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
          let { data } = await TracksApi.searchSpotify(query);
          setResults(data?.tracks?.items || []);
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
        selectedTrack.external_id === resultInQuestion.id &&
        selectedTrack.source === "Spotify"
    );
  }

  return (
    <div className="my-4">
      {loading ? (
        <PageLoading />
      ) : (
        results.map((result) => (
          <SpotifyTrackResult
            track={result}
            key={result.id}
            onClick={onTrackClick}
            selected={isSelected(result)}
          />
        ))
      )}
    </div>
  );
}
