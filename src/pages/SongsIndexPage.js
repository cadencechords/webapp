import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { ADD_SONGS } from "../utils/constants";
import Button from "../components/Button";
import CreateSongDialog from "../components/CreateSongDialog";
import FadeIn from "../components/FadeIn";
import MobileHeader from "../components/MobileHeader";
import NoDataMessage from "../components/NoDataMessage";
import PageTitle from "../components/PageTitle";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";
import QuickAdd from "../components/QuickAdd";
import SongApi from "../api/SongApi";
import SongsList from "../components/SongsList";
import WellInput from "../components/inputs/WellInput";
import { selectCurrentMember } from "../store/authSlice";

export default function SongsIndexPage() {
  useEffect(() => (document.title = "Songs"));
  const [songs, setSongs] = useState([]);
  const currentMember = useSelector(selectCurrentMember);
  const [isCreating, setIsCreating] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setSongs(SongApi.getAll());
  }, []);

  let content = null;

  if (songs.length === 0) {
    content = (
      <NoDataMessage>
        You don't have any songs in your library yet. Click the add button to
        get started.
      </NoDataMessage>
    );
  } else {
    content = (
      <FadeIn className="mb-10 delay-100">
        <SongsList songs={filteredSongs()} />
      </FadeIn>
    );
  }

  function filteredSongs() {
    return songs?.filter((song) =>
      song.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  function handleSongCreated(newSong) {
    setSongs((currentSongs) => [newSong, ...currentSongs]);
  }

  return (
    <>
      <div className="hidden sm:block">
        <PageTitle title="Songs" />
      </div>
      <div className="h-14 mb-4 sm:hidden">
        <MobileHeader
          title="Songs"
          className="shadow-inner"
          onAdd={() => setIsCreating(true)}
          canAdd={songs.length < 10}
        />
      </div>
      {songs.length > 0 && (
        <>
          <FadeIn className="pl-2 mb-2">{songs.length} total</FadeIn>
          <FadeIn className="mb-4 lg:text-sm delay-75">
            <WellInput
              placeholder="Search your songs"
              value={query}
              onChange={setQuery}
            />
          </FadeIn>
        </>
      )}
      {content}

      {currentMember.can(ADD_SONGS) && (
        <>
          <div className="hidden sm:block">
            <QuickAdd onAdd={() => setIsCreating(true)} />
          </div>
          <CreateSongDialog
            open={isCreating}
            onCloseDialog={() => setIsCreating(false)}
            onCreate={handleSongCreated}
          />
          <Button
            variant="open"
            className="bg-white dark:bg-dark-gray-700 fixed bottom-12 left-0 flex-center sm:hidden h-12"
            full
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px -5px 17px 0px" }}
            onClick={() => setIsCreating(true)}
          >
            <PlusCircleIcon className="h-4 w-4 mr-2" />
            Add new song
          </Button>
        </>
      )}
    </>
  );
}
