import {
  selectCurrentMember,
  selectCurrentTeam,
  setCurrentTeam,
} from '../store/authSlice';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EDIT_TEAM } from '../utils/constants';
import FileApi from '../api/FileApi';
import PageTitle from '../components/PageTitle';
import ProfilePicture from '../components/ProfilePicture';
import TeamApi from '../api/TeamApi';
import useDebouncedCallback from '../hooks/useDebouncedCallback';
import { format } from '../utils/date';
import { reportError } from '../utils/error';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import Button from '../components/Button';
import Icon from '../components/Icon';
import DetailItem from '../components/lists/DetailItem';
import FormatPresets from '../components/FormatPresets';
import type { ChangeEvent } from 'react';

export default function TeamDetailPage() {
  const currentTeam = useSelector(selectCurrentTeam);
  const currentSubscription = useSelector(selectCurrentSubscription);
  useEffect(() => {
    document.title = currentTeam ? currentTeam.name : 'Team Details';
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  // Non-null: read only once the current team loads, and Content renders the
  // page only once the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;

  const handleOpenFileDialog = () => {
    // Non-null: the photo button that calls this renders with the file input.
    inputRef.current!.click();
  };

  const handleImageSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    // Non-null (files, here and below): a file input's `files` is never null.
    // Non-null (currentTeam, here and in the other handlers): they're called
    // from the controls rendered once the current team is loaded.
    const tempImageUrl = URL.createObjectURL(e.target.files![0]);
    dispatch(setCurrentTeam({ ...currentTeam!, image_url: tempImageUrl }));

    try {
      try {
        await FileApi.addImageToTeam(e.target.files![0]);
      } catch (error) {
        reportError(error);
        dispatch(setCurrentTeam({ ...currentTeam!, image_url: null }));
      } finally {
        URL.revokeObjectURL(tempImageUrl);
      }
    } catch (error) {
      reportError(error);
    }
  };

  const handleDeleteImage = async () => {
    try {
      dispatch(setCurrentTeam({ ...currentTeam!, image_url: null }));
      await FileApi.deleteTeamImage();
    } catch (error) {
      reportError(error);
    }
  };

  const handleNameChange = (newName: string) => {
    dispatch(setCurrentTeam({ ...currentTeam!, name: newName }));
    debounce(newName);
  };

  const debounce = useDebouncedCallback(
    (newName: string) => {
      try {
        TeamApi.update({ name: newName });
      } catch (error) {
        reportError(error);
      }
    },
    1000,
    'flush'
  );

  if (currentTeam && currentSubscription) {
    const canEdit = currentMember.can(EDIT_TEAM);
    const isTrialing = currentSubscription.status === 'trialing';

    // M3E, like a profile: the team on a card (its picture, an editable name,
    // and photo buttons for editors), its details as a segmented list, then
    // the format presets on Pro.
    return (
      <div className="max-w-2xl mx-auto mt-4 flex flex-col gap-8 font-plain text-on-surface">
        <div className="flex flex-col gap-4">
          <section className="flex flex-col items-center gap-3 px-6 pt-8 pb-6 rounded-extra-large-increased bg-surface-container-low">
            <ProfilePicture
              url={currentTeam.image_url}
              name={currentTeam.name}
              size="xl"
            />
            <PageTitle
              title={currentTeam.name}
              align="center"
              editable={canEdit}
              className="text-center"
              onChange={handleNameChange}
            />
            {canEdit && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelected}
                  className="hidden"
                  ref={inputRef}
                />
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant="accent"
                    color="gray"
                    size="sm"
                    className="flex-center gap-2"
                    onClick={handleOpenFileDialog}
                  >
                    <Icon name="photo_camera" className="w-5 h-5" />
                    {currentTeam.image_url ? 'Change photo' : 'Add photo'}
                  </Button>
                  {currentTeam.image_url && (
                    <Button
                      variant="open"
                      color="red"
                      size="sm"
                      onClick={handleDeleteImage}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </>
            )}
          </section>

          <div className="list-segmented">
            <DetailItem icon="calendar_month" label="Created">
              {format(currentTeam.created_at, 'MMM D, YYYY')}
            </DetailItem>
            <DetailItem icon="credit_card" label="Plan">
              <span className="flex items-center gap-2">
                {currentSubscription.plan_name}
                {isTrialing && (
                  <span className="inline-flex items-center h-6 px-2 rounded-full bg-tertiary-container text-on-tertiary-container text-label-medium">
                    Trial
                  </span>
                )}
              </span>
            </DetailItem>
          </div>
        </div>

        {currentSubscription.isPro && (
          <FormatPresets
            defaultFormatPreset={currentTeam.default_format}
            currentMember={currentMember}
          />
        )}
      </div>
    );
  } else {
    return <>Loading...</>;
  }
}
