import { DELETE_SETLISTS, EDIT_SETLISTS, EDIT_SONGS } from "../utils/constants";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";

import Button from "../components/Button";
import CalendarIcon from "@heroicons/react/outline/CalendarIcon";
import ChangeSetlistDateDialog from "../components/ChangeSetlistDateDialog";
import PageTitle from "../components/PageTitle";
import PlayIcon from "@heroicons/react/solid/PlayIcon";
import SectionTitle from "../components/SectionTitle";
import SetlistApi from "../api/SetlistApi";
import SetlistSongsList from "../components/SetlistSongsList";
import _ from "lodash";
import { selectCurrentMember } from "../store/authSlice";
import { setSetlistBeingPresented } from "../store/presenterSlice";
import { toShortDate } from "../utils/DateUtils";

export default function SetlistDetailPage() {
  const [setlist, setSetlist] = useState();
  const [showChangeDateDialog, setShowChangeDateDialog] = useState(false);
  const router = useHistory();
  const id = useParams().id;
  const currentMember = useSelector(selectCurrentMember);
  const dispatch = useDispatch();

  useEffect(
    () => (document.title = setlist ? setlist.name + " | Sets" : "Set"),
    [setlist]
  );
  useEffect(() => {
    let result = SetlistApi.getOne(id);
    setSetlist(result.data);
  }, [id]);

  const handleSongsAdded = (songsAdded) => {
    setSetlist({ ...setlist, songs: [...setlist.songs, ...songsAdded] });
  };

  const handleSongsReordered = (reorderedSongs) => {
    setSetlist({ ...setlist, songs: reorderedSongs });
  };

  const handleSongRemoved = (songIdToRemove) => {
    let filteredSongs = setlist.songs?.filter(
      (song) => song.id !== songIdToRemove
    );
    setSetlist({ ...setlist, songs: filteredSongs });
  };

  const handleNameChange = (newName) => {
    setSetlist({ ...setlist, name: newName });
    debounce(newName);
  };

  const handleOpenInPresenter = () => {
    dispatch(setSetlistBeingPresented(setlist));
    router.push(`/sets/${id}/present`);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce((newName) => {
      SetlistApi.updateOne({ name: newName }, id);
    }, 1000),
    []
  );

  const handleDelete = () => {
    SetlistApi.deleteOne(id);
    router.push("/sets");
  };

  const handleClickDateDialog = () => {
    if (currentMember.can(EDIT_SONGS)) {
      setShowChangeDateDialog(true);
    }
  };

  if (setlist) {
    return (
      <div className="mt-4">
        <div className="grid md:grid-cols-3 grid-cols-1 gap-y-5 md:gap-5 w-full py-2">
          <div className="col-span-1">
            <PageTitle
              title={setlist?.name}
              editable={currentMember.can(EDIT_SETLISTS)}
              onChange={handleNameChange}
            />
            <div
              className="text-gray-500 flex items-center cursor-pointer mb-4"
              onClick={handleClickDateDialog}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span className="leading-6 h-6">
                {toShortDate(setlist?.scheduled_date)}
              </span>
            </div>
            <div className="md:block flex gap-4 w-full">
              {setlist?.songs?.length > 0 && (
                <>
                  <Button
                    variant="outlined"
                    color="black"
                    onClick={handleOpenInPresenter}
                    className="flex-center mb-2 md:hidden"
                    size="md"
                    full
                  >
                    <PlayIcon className="h-5 w-5  text-purple-700 dark:text-purple-500 mr-4" />
                    Perform
                  </Button>
                  <Button
                    variant="outlined"
                    color="black"
                    onClick={handleOpenInPresenter}
                    className="mb-2 hidden md:flex justify-center items-center"
                    size="xs"
                  >
                    <PlayIcon className="h-4 w-4 text-purple-700 dark:text-purple-500 mr-1" />
                    Perform
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <SetlistSongsList
              songs={setlist?.songs}
              onSongsAdded={handleSongsAdded}
              onReordered={handleSongsReordered}
              onSongRemoved={handleSongRemoved}
            />
          </div>
        </div>
        {currentMember.can(DELETE_SETLISTS) && (
          <div>
            <SectionTitle title="Delete" underline />
            <Button color="red" onClick={handleDelete}>
              Delete this set
            </Button>
          </div>
        )}
        <ChangeSetlistDateDialog
          open={showChangeDateDialog}
          onCloseDialog={() => setShowChangeDateDialog(false)}
          scheduledDate={setlist?.scheduled_date}
          onDateChanged={(newScheduledDate) =>
            setSetlist({ ...setlist, scheduled_date: newScheduledDate })
          }
        />
      </div>
    );
  }

  return null;
}
