import SectionTitle from '../components/SectionTitle';
import AccountPageHeader from '../components/settings/AccountPageHeader';
import { SettingsRowText } from '../components/settings/SettingsRow';
import Toggle from '../components/Toggle';
import {
  LIST_ITEM_INTERACTIVE,
  LIST_ITEM_TWO_LINE,
} from '../components/lists/listItem';
import useTheme from '../hooks/useTheme';
import {
  useCurrentUser,
  useUpdateCurrentUser,
} from '../hooks/api/currentUser.hooks';
import Alert from '../components/Alert';
import PageLoading from '../components/PageLoading';
import SongPreferencesForm from '../components/SongPreferencesForm';
import type { UserUpdates } from '../api/UserApi';

export default function AccountAppearancePage() {
  const { data: currentUser, error } = useCurrentUser({
    refetchOnWindowFocus: false,
  });
  const { run: updateCurrentUser } = useUpdateCurrentUser();
  const { isDark, setIsDark } = useTheme();
  function handleSongPreferencesChange(field: string, value: boolean) {
    const updates: UserUpdates = {};
    if (field === 'hide_chords') {
      updates.prefers_hide_chords = value;
    }
    updateCurrentUser(updates);
  }

  if (currentUser)
    return (
      <div className="max-w-2xl mx-auto font-plain">
        <AccountPageHeader title="Appearance" />
        <section className="mb-8">
          <SectionTitle title="Theme" />
          <div className="list-segmented">
            {/* The same switch as the account menu's: the row toggles it. */}
            <Toggle
              enabled={isDark}
              onChange={setIsDark}
              className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE}`}
              labelClassName="flex items-center flex-1 min-w-0 gap-4 cursor-pointer"
              label={
                <SettingsRowText
                  icon="palette"
                  title="Dark theme"
                  description="Easier on the eyes in low light"
                />
              }
            />
          </div>
        </section>
        <section>
          <SectionTitle title="Songs" />
          <SongPreferencesForm
            // Non-null: the API sends every user's format preferences, and
            // the form reads them straight away, as it did before.
            songPreferences={currentUser.format_preferences!}
            onChange={handleSongPreferencesChange}
          />
        </section>
      </div>
    );

  if (error)
    return (
      <div className="max-w-2xl mx-auto">
        <Alert color="red">
          There was an issue retrieving your preferences
        </Alert>
      </div>
    );

  return <PageLoading />;
}
