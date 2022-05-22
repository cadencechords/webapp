import {
  selectCurrentMember,
  selectCurrentTeam,
  updateTeamName,
  updateTeamPicture,
} from "../store/authSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { EDIT_TEAM } from "../utils/constants";
import MobileProfilePictureMenu from "../components/mobile menus/MobileProfilePictureMenu";
import PageTitle from "../components/PageTitle";
import ProfilePicture from "../components/ProfilePicture";
import TeamApi from "../api/TeamApi";
import _ from "lodash";
import { format } from "../utils/date";

export default function TeamDetailPage() {
  const currentTeam = useSelector(selectCurrentTeam).team;
  useEffect(
    () => (document.title = currentTeam ? currentTeam.name : "Team Details")
  );
  const inputRef = useRef();
  const [showImageDialog, setShowImageDialog] = useState(false);
  const dispatch = useDispatch();
  const currentMember = useSelector(selectCurrentMember);

  const handleOpenFileDialog = () => {
    inputRef.current.click();
  };

  const handleImageSelected = async (e) => {
    setShowImageDialog(false);
    const reader = new FileReader();

    reader.onload = () => {
      try {
        TeamApi.updateProfilePicture(reader.result);
        dispatch(updateTeamPicture(reader.result));
      } catch (error) {
        alert("Uh oh, looks like we weren't able to do that.");
      }
    };

    if (e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
  };

  const handleTeamImageClick = () => {
    if (currentMember.can(EDIT_TEAM)) {
      setShowImageDialog(true);
    }
  };

  const handleDeleteImage = async () => {
    dispatch(updateTeamPicture(null));
    TeamApi.updateProfilePicture(null);
  };

  const handleNameChange = (newName) => {
    dispatch(updateTeamName(newName));
    debounce(newName);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce((newName) => {
      TeamApi.update({ name: newName });
    }, 500),
    []
  );

  if (currentTeam) {
    return (
      <div className="flex items-center flex-col pt-4 max-w-sm mx-auto">
        <ProfilePicture
          url={currentTeam.image_url}
          size="lg"
          onClick={handleTeamImageClick}
        />
        <PageTitle
          title={currentTeam.name}
          align="center"
          editable={currentMember.can(EDIT_TEAM)}
          className="text-center"
          onChange={handleNameChange}
        />
        {currentMember.can(EDIT_TEAM) && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelected}
              className="hidden"
              ref={inputRef}
            />
            <MobileProfilePictureMenu
              open={showImageDialog}
              onCloseDialog={() => setShowImageDialog(false)}
              onOpenFileDialog={handleOpenFileDialog}
              onDeleteImage={handleDeleteImage}
            />
          </>
        )}
        <div className="text-gray-600 dark:text-dark-gray-200 flex-between border-b dark:border-dark-gray-600 py-2 w-full">
          <div className="font-semibold">Created:</div>
          {format(currentTeam.created_at, "MMM D YYYY")}
        </div>
      </div>
    );
  } else {
    return "Loading...";
  }
}
