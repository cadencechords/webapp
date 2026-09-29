import { selectCurrentUser, setCurrentUser } from '../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState } from 'react';

import Button from './Button';
import FileApi from '../api/FileApi';
import ProfilePicture from './ProfilePicture';
import { reportError } from '../utils/error';
import Icon from './Icon';
import type { User } from '../types';
import { getNameOrEmail } from '../utils/model';

type ProfilePictureDetailProps = {
  url: User['image_url'];
};

export default function ProfilePictureDetail({
  url,
}: ProfilePictureDetailProps) {
  const dispatch = useDispatch();
  // Non-null: only AccountProfilePage renders this, once the current user
  // loads.
  const currentUser = useSelector(selectCurrentUser)!;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleOpenFileDialog = () => {
    // Non-null: the file input always renders, so the ref is set by the time
    // a button calls this.
    inputRef.current!.click();
  };

  const handleImageSelected = async (files: FileList) => {
    const tempImageUrl = URL.createObjectURL(files[0]);
    dispatch(setCurrentUser({ ...currentUser, image_url: tempImageUrl }));

    try {
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

  // A card with the photo, large and centered, and a tonal Change photo
  // button (Remove beside it when there's a photo).
  return (
    <section className="flex flex-col items-center gap-4 px-6 pt-8 pb-6 rounded-extra-large-increased bg-surface-container-low text-on-surface">
      <ProfilePicture url={url} name={getNameOrEmail(currentUser)} size="xl2" />
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        accept="image/*"
        // Non-null: `files` is null only on inputs that aren't type="file".
        onChange={e => handleImageSelected(e.target.files!)}
      />
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="accent"
          color="gray"
          size="sm"
          className="flex-center gap-2"
          onClick={handleOpenFileDialog}
          loading={uploading}
        >
          <Icon name="photo_camera" className="w-5 h-5" />
          {url ? 'Change photo' : 'Add photo'}
        </Button>
        {url && (
          <Button
            variant="open"
            color="red"
            size="sm"
            onClick={handleDeleteImage}
            loading={removing}
          >
            Remove
          </Button>
        )}
      </div>
    </section>
  );
}
