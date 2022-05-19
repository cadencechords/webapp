import Button from "./Button";
import { EDIT_BINDERS } from "../utils/constants";
import KeyBadge from "./KeyBadge";
import NoDataMessage from "./NoDataMessage";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";
import SearchSongsDialog from "./SearchSongsDialog";
import SectionTitle from "./SectionTitle";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import { hasAnyKeysSet } from "../utils/SongUtils";
import { selectCurrentMember } from "../store/authSlice";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function BinderSongsList({ boundSongs, onAdd, onRemoveSong }) {
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const router = useHistory();
  const currentMember = useSelector(selectCurrentMember);

  const handleOpenSong = (songId) => {
    router.push(`/songs/${songId}`);
  };

  return (
    <>
      <div className="sm:block hidden">
        <div className="flex-between mb-2">
          <SectionTitle title="Songs in this binder" />
          {currentMember.can(EDIT_BINDERS) && (
            <Button
              variant="open"
              size="xs"
              onClick={() => setShowSearchDialog(true)}
              bold
              color="blue"
            >
              Add Songs
            </Button>
          )}
        </div>
        <table className="w-full">
          <TableHead columns={["NAME", ""]} />
          <tbody>
            {boundSongs?.length > 0 ? (
              boundSongs?.map((song) => (
                <TableRow
                  columns={[
                    <>
                      {song.name}
                      {hasAnyKeysSet(song) && (
                        <KeyBadge
                          songKey={song.transposed_key || song.original_key}
                        />
                      )}
                    </>,
                  ]}
                  key={song.id}
                  onClick={() => handleOpenSong(song.id)}
                  removable={currentMember.can(EDIT_BINDERS)}
                  onRemove={() => onRemoveSong(song)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={2}>
                  <NoDataMessage type="songs" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden">
        <SectionTitle title="Songs in this binder" />
        {boundSongs?.length > 0
          ? boundSongs.map((song) => (
              <div
                className="border-b dark:border-dark-gray-600 py-2.5 flex-between px-2 last:border-0 cursor-pointer bg-white dark:bg-dark-gray-900 transition-colors hover:bg-gray-50 dark:hover:bg-dark-gray-800 focus:bg-gray-50 dark:focus:bg-dark-gray-800 "
                key={song.id}
              >
                <div
                  onClick={() => handleOpenSong(song.id)}
                  className="flex-grow"
                >
                  <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {song.name}{" "}
                    {hasAnyKeysSet(song) && (
                      <KeyBadge
                        songKey={song.transposed_key || song.original_key}
                      />
                    )}
                  </div>
                </div>
                {currentMember.can(EDIT_BINDERS) && (
                  <Button
                    variant="open"
                    color="black"
                    size="xs"
                    onClick={() => onRemoveSong(song)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          : "No songs in this binder yet"}
      </div>

      <SearchSongsDialog
        open={showSearchDialog}
        onCloseDialog={() => setShowSearchDialog(false)}
        onAdd={onAdd}
        boundSongs={boundSongs}
      />
      <Button
        variant="open"
        className="bg-white dark:bg-dark-gray-700 fixed bottom-12 left-0 rounded-none flex-center sm:hidden h-12"
        full
        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px -5px 17px 0px" }}
        onClick={() => setShowSearchDialog(true)}
      >
        <PlusCircleIcon className="h-4 w-4 mr-2" />
        Add more songs
      </Button>
    </>
  );
}
