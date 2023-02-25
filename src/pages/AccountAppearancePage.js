import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import ArrowNarrowLeftIcon from '@heroicons/react/outline/ArrowNarrowLeftIcon';
import PageTitle from '../components/PageTitle';
import SectionHeading from '../components/SectionHeading';
import {
  useCurrentUser,
  useUpdateCurrentUser,
} from '../hooks/api/currentUser.hooks';
import Alert from '../components/Alert';
import PageLoading from '../components/PageLoading';
import SongPreferencesForm from '../components/SongPreferencesForm';

export default function AccountAppearancePage() {
  const { data: currentUser, error } = useCurrentUser({
    refetchOnWindowFocus: false,
  });
  const { run: updateCurrentUser } = useUpdateCurrentUser();
  function handleSongPreferencesChange(field, value) {
    const updates = {};
    if (field === 'hide_chords') {
      updates.prefers_hide_chords = value;
    }
    updateCurrentUser(updates);
  }

  if (currentUser)
    return (
      <div className="max-w-4xl mx-auto">
        <Link to="/account">
          <Button variant="open" color="gray">
            <div className="flex-center">
              <ArrowNarrowLeftIcon className="w-4 h-4 mr-4" />
              Menu
            </div>
          </Button>
        </Link>
        <PageTitle title="Appearance" className="mb-4" />

        <div className="pb-2">
          <SectionHeading heading="Song preferences" />
        </div>
        <SongPreferencesForm
          songPreferences={currentUser.format_preferences}
          onChange={handleSongPreferencesChange}
        />
      </div>
    );

  if (error)
    return (
      <div className="max-w-4xl mx-auto">
        <Alert color="red">
          There was an issue retrieving your preferences
        </Alert>
      </div>
    );

  return <PageLoading />;
}
