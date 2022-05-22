import { useRef, useState } from "react";

import Button from "./Button";
import Label from "./Label";
import MobileProfilePictureMenu from "./mobile menus/MobileProfilePictureMenu";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import ProfilePicture from "./ProfilePicture";
import MembershipsApi from "../api/membershipsApi";
import { useDispatch } from "react-redux";
import { updateImage } from "../store/authSlice";

export default function ProfilePictureDetail({ url, onChange }) {
  const [showMobileActionsDialog, setShowMobileActionsDialog] = useState(false);
  const inputRef = useRef();
  const dispatch = useDispatch();

  const handleOpenFileDialog = () => {
    inputRef.current.click();
  };

  const handleImageSelected = async (files) => {
    setShowMobileActionsDialog(false);
    const reader = new FileReader();

    reader.onload = () => {
      try {
        MembershipsApi.updateMyMember({ image_url: reader.result });
        dispatch(updateImage(reader.result));
        onChange(reader.result);
      } catch (error) {
        alert("Uh oh, looks like we weren't able to do that.");
      }
    };

    if (files?.[0]) reader.readAsDataURL(files[0]);
  };

  const handleDeleteImage = async () => {
    MembershipsApi.updateMyMember({ image_url: null });
    dispatch(updateImage(null));
    onChange(null);
  };

  return (
    <>
      <Label>Photo</Label>
      <div className="m-auto mb-4 relative">
        <div className="flex-center">
          <ProfilePicture url={url} size="xl2" />
        </div>
        <button
          onClick={() => setShowMobileActionsDialog(true)}
          className="focus:outline-none outline-none absolute bottom-0 left-1/2 ml-3 mb-1 border border-white bg-blue-700 p-1.5 rounded-full md:hidden"
        >
          <PencilIcon className="h-4 text-white" />
        </button>
      </div>

      <input
        type="file"
        className="hidden"
        ref={inputRef}
        accept="image/*"
        onChange={(e) => handleImageSelected(e.target.files)}
      />
      <div className="md:flex md:justify-end hidden">
        <span className="md:mr-2 md:w-20">
          <Button
            color="black"
            variant="outlined"
            full
            onClick={handleOpenFileDialog}
          >
            Change
          </Button>
        </span>
        <Button
          variant="open"
          color="black"
          className="md:w-20"
          onClick={handleDeleteImage}
        >
          Remove
        </Button>
      </div>
      <MobileProfilePictureMenu
        open={showMobileActionsDialog}
        onCloseDialog={() => setShowMobileActionsDialog(false)}
        onOpenFileDialog={handleOpenFileDialog}
        onDeleteImage={handleDeleteImage}
      />
    </>
  );
}
