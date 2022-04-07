import React, { useEffect, useState } from "react";
import { reportError } from "../utils/error";
import PageLoading from "./PageLoading";
import TracksApi from "../api/tracksApi";
import AppleMusicTrackResult from "./AppleMusicTrackResult";

export default function AppleMusicSearchResults({
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
          let { data } = await TracksApi.searchAppleMusic(query);
          setResults(data?.results?.songs?.data || []);
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
        selectedTrack.source === "Apple Music"
    );
  }

  return (
    <div className="my-4">
      {loading ? (
        <PageLoading />
      ) : (
        results.map((result) => (
          <AppleMusicTrackResult
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
