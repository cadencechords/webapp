import { useHistory, useParams } from "react-router";

import AddSongsToSetDialog from "./AddSongsToSetDialog";
import Button from "./Button";
import DragAndDropTable from "./DragAndDropTable";
import { EDIT_SETLISTS } from "../utils/constants";
import NoDataMessage from "./NoDataMessage";
import SetlistApi from "../api/SetlistApi";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function SetlistSongsList({
  songs,
  onSongsAdded,
  onReordered,
  onSongRemoved,
}) {
  const [showSongsDialog, setShowSongsDialog] = useState(false);
  const id = useParams().id;
  const router = useHistory();
  const currentMember = useSelector(selectCurrentMember);

  const handleReordered = async (reorderedSongs) => {
    SetlistApi.updateSongOrder(id, reorderedSongs);
    onReordered(reorderedSongs);
  };

  const handleRemoveSong = (songIdToRemove) => {
    SetlistApi.removeSong(id, songIdToRemove);
    onSongRemoved(songIdToRemove);
  };

  const handleRouteToSongDetail = (songId) => {
    router.push(`/songs/${songId}`);
  };

  return (
    <>
      <div className="font-semibold text-lg pb-2 flex-between border-b dark:border-dark-gray-600">
        Songs
        {currentMember.can(EDIT_SETLISTS) && (
          <Button
            size="xs"
            variant="open"
            onClick={() => setShowSongsDialog(true)}
          >
            Add Song
          </Button>
        )}
      </div>

      {songs?.length > 0 ? (
        <DragAndDropTable
          items={songs}
          onReorder={handleReordered}
          removeable={currentMember.can(EDIT_SETLISTS)}
          onRemove={handleRemoveSong}
          onClick={handleRouteToSongDetail}
          rearrangeable={currentMember.can(EDIT_SETLISTS)}
        />
      ) : (
        <NoDataMessage type="songs" />
      )}

      <AddSongsToSetDialog
        open={showSongsDialog}
        onCloseDialog={() => setShowSongsDialog(false)}
        onAdded={onSongsAdded}
        boundSongs={songs}
      />
    </>
  );
}
