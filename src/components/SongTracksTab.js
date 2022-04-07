import Track from "./Track";
import Button from "./Button";
import PlusIcon from "@heroicons/react/outline/PlusIcon";
import AddTracksDialog from "../dialogs/AddTracksDialog";
import { useState } from "react";
import NoDataMessage from "./NoDataMessage";

export default function SongTracksTab({ song, onDeleted, onTracksAdded }) {
  const [showAddTracks, setShowAddTracks] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          variant="open"
          color="black"
          className="flex-center"
          onClick={() => setShowAddTracks(true)}
        >
          <PlusIcon className="w-4 h-4 text-blue-600 dark:text-dark-blue mr-2" />
          Add track
        </Button>
      </div>
      {song?.tracks?.length === 0 ? (
        <NoDataMessage type="tracks" />
      ) : (
        <div className="overflow-x-scroll whitespace-nowrap flex">
          {song?.tracks?.map((track) => (
            <Track
              key={track.id}
              track={track}
              songId={song.id}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      )}
      <AddTracksDialog
        open={showAddTracks}
        onCloseDialog={() => setShowAddTracks(false)}
        song={song}
        onTracksAdded={onTracksAdded}
      />
    </>
  );
}
