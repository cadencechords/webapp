import {
  adjustSongBeingPresented,
  selectSongBeingPresented,
} from "../store/presenterSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useRef, useState } from "react";

import Roadmap from "../components/Roadmap";
import SongAdjustmentsDrawer from "../components/SongAdjustmentsDrawer";
import SongPresenterBottomSheet from "../components/SongPresenterBottomSheet";
import SongPresenterTopBar from "../components/SongPresenterTopBar";
import { html } from "../utils/SongUtils";

export default function SongPresenterPage() {
  const router = useHistory();
  const id = useParams().id;
  const song = useSelector(selectSongBeingPresented);
  const dispatch = useDispatch();
  const pageRef = useRef();
  const [bottomSheet, setBottomSheet] = useState();
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const [showOptionsDrawer, setShowOptionsDrawer] = useState(false);

  function handleFormatChange(field, value) {
    let updatedFormat = { ...song.format, [field]: value };
    dispatch(adjustSongBeingPresented({ format: updatedFormat }));
  }

  function handleSongChange(field, value) {
    dispatch(adjustSongBeingPresented({ [field]: value }));
  }

  function handleShowBottomSheet(sheet) {
    setShowBottomSheet(true);
    setShowOptionsDrawer(false);
    setBottomSheet(sheet);
  }

  function handleToggleRoadmap() {
    dispatch(adjustSongBeingPresented({ show_roadmap: !song.show_roadmap }));
  }

  if (song && song.format) {
    return (
      <div ref={pageRef} id="page">
        <SongPresenterTopBar
          song={song}
          onShowOptionsDrawer={() => setShowOptionsDrawer(true)}
          onShowBottomSheet={handleShowBottomSheet}
        />

        <div className="mx-auto max-w-6xl p-3">
          <Roadmap
            song={song}
            onSongChange={handleSongChange}
            onToggleRoadmap={handleToggleRoadmap}
          />
          <div className="relative w-full">
            <div id="song" className="mr-0">
              {html(song)}
            </div>
          </div>
        </div>

        <SongAdjustmentsDrawer
          open={showOptionsDrawer}
          onClose={() => setShowOptionsDrawer(false)}
          song={song}
          onFormatChange={handleFormatChange}
          onSongChange={handleSongChange}
          onShowSheet={handleShowBottomSheet}
        />

        <SongPresenterBottomSheet
          sheet={bottomSheet}
          open={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
          song={song}
          onSongChange={handleSongChange}
        />
      </div>
    );
  } else {
    router.push(`/songs/${id}`);
    return null;
  }
}
