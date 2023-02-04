import { selectCurrentUser, setCurrentUser } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';

import Button from './Button';
import FileApi from '../api/FileApi';
import Label from './Label';
import MobileProfilePictureMenu from './mobile menus/MobileProfilePictureMenu';
import PencilIcon from '@heroicons/react/outline/PencilIcon';
import ProfilePicture from './ProfilePicture';
import { reportError } from '../utils/error';

export default function ProfilePictureDetail({ url }) {
  const [showMobileActionsDialog, setShowMobileActionsDialog] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleOpenFileDialog = () => {
    inputRef.current.click();
  };

  const handleImageSelected = async files => {
    let tempImageUrl = URL.createObjectURL(files[0]);
    dispatch(setCurrentUser({ ...currentUser, image_url: tempImageUrl }));

    try {
      setShowMobileActionsDialog(false);
      setUploading(true);
      await FileApi.addImageToUser(files[0]);
    } catch (error) {
      reportError(error);
      dispatch(setCurrentUser({ ...currentUser, image_url: null }));
    } finally {
      setUploading(false);
      URL.revokeObjectURL(tempImageUrl);
    }
  };

  const handleDeleteImage = async () => {
    try {
      setRemoving(true);
      await FileApi.deleteUserImage();
      dispatch(setCurrentUser({ ...currentUser, image_url: null }));
    } catch (error) {
      reportError(error);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <Label>Photo</Label>
      <div className="relative m-auto mb-4">
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
        onChange={e => handleImageSelected(e.target.files)}
      />
      <div className="hidden md:flex md:justify-end">
        <span className="md:mr-2 md:w-20">
          <Button
            color="blue"
            variant="accent"
            full
            size="xs"
            onClick={handleOpenFileDialog}
            loading={uploading}
          >
            Change
          </Button>
        </span>
        <Button
          variant="open"
          color="blue"
          className="md:w-20"
          onClick={handleDeleteImage}
          loading={removing}
          size="xs"
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
