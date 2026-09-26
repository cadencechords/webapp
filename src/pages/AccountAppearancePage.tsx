import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import PageTitle from '../components/PageTitle';
import SectionHeading from '../components/SectionHeading';
import {
  useCurrentUser,
  useUpdateCurrentUser,
} from '../hooks/api/currentUser.hooks';
import Alert from '../components/Alert';
import PageLoading from '../components/PageLoading';
import SongPreferencesForm from '../components/SongPreferencesForm';
import Icon from '../components/Icon';
import type { UserUpdates } from '../api/UserApi';

export default function AccountAppearancePage() {
  const { data: currentUser, error } = useCurrentUser({
    refetchOnWindowFocus: false,
  });
  const { run: updateCurrentUser } = useUpdateCurrentUser();
  function handleSongPreferencesChange(field: string, value: boolean) {
    const updates: UserUpdates = {};
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
              <Icon name="arrow_back" className="w-4 h-4 mr-4" />
              Menu
            </div>
          </Button>
        </Link>
        <PageTitle title="Appearance" className="mb-4" />

        <div className="pb-2">
          <SectionHeading heading="Song preferences" />
        </div>
        <SongPreferencesForm
          // Non-null: the API sends every user's format preferences, and the
          // form reads them straight away, as it did before.
          songPreferences={currentUser.format_preferences!}
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
