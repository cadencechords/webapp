import { useEffect, useState } from 'react';
import type { AxiosResponse } from 'axios';

import AddCancelActions from './buttons/AddCancelActions';
import FixedBottomMobile from './FixedBottomMobile';
import Label from './Label';
import NoDataMessage from './NoDataMessage';
import OrDivider from './OrDivider';
import OutlinedInput from './inputs/OutlinedInput';
import SongApi from '../api/SongApi';
import StyledDialog from './StyledDialog';
import ThemeApi from '../api/ThemeApi';
import ThemeOptions from './ThemeOptions';
import { reportError } from '../utils/error';
import type { Song, Tag } from '../types';

type AddThemeDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  currentSong: Pick<Song, 'id' | 'themes'>;
  onThemesAdded: (themes: Tag[]) => void;
};

export default function AddThemeDialog({
  open,
  onCloseDialog,
  currentSong,
  onThemesAdded,
}: AddThemeDialogProps) {
  const [availableThemes, setAvailableThemes] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTheme, setNewTheme] = useState('');
  const [themesToAdd, setThemesToAdd] = useState<Tag[]>([]);
  const [savingAdditions, setSavingAdditions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchThemes() {
      setLoading(true);
      try {
        const { data } = await ThemeApi.getAll();

        const availableThemes: Tag[] = [];

        data?.forEach(possiblyAvailableTheme => {
          const index = currentSong.themes?.findIndex(
            alreadyBoundTheme =>
              alreadyBoundTheme.id === possiblyAvailableTheme.id
          );

          if (index === -1) {
            availableThemes.push(possiblyAvailableTheme);
          }
        });

        setAvailableThemes(availableThemes);
      } catch (error) {
        reportError(error);
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchThemes();
    }
  }, [open, currentSong]);

  const handleCreateTheme = async () => {
    setCreating(true);
    try {
      const { data } = await ThemeApi.createOne({ name: newTheme });
      setNewTheme('');
      setAvailableThemes([...availableThemes, data]);
    } catch (error) {
      reportError(error);
    } finally {
      setCreating(false);
    }
  };

  const handleSaveThemes = async () => {
    setSavingAdditions(true);
    try {
      const idsToAdd = themesToAdd.map(theme => theme.id);
      // Add is disabled until a theme is picked, so addThemes has ids to send
      // and returns a request (it returns undefined only for no ids). The response
      // is read as the added themes: SongDetailPage concatenates it onto the
      // song's themes.
      const result = (await SongApi.addThemes(
        currentSong.id,
        idsToAdd
      )) as AxiosResponse<Tag[]>;
      onThemesAdded(result.data);
      handleClose();
    } catch (error) {
      reportError(error);
    } finally {
      setSavingAdditions(false);
    }
  };

  const handleClose = () => {
    setNewTheme('');
    setAvailableThemes([]);
    setThemesToAdd([]);
    setCreating(false);
    setLoading(false);
    setSavingAdditions(false);
    setSearchTerm('');
    onCloseDialog();
  };

  const handleThemeToggled = (checked: boolean, theme: Tag) => {
    if (checked) {
      setThemesToAdd([...themesToAdd, theme]);
    } else {
      const updatedThemes = themesToAdd.filter(
        addedTheme => addedTheme !== theme
      );
      setThemesToAdd(updatedThemes);
    }
  };

  const filterAvailableThemes = () => {
    return availableThemes.filter(theme =>
      theme.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <StyledDialog
      open={open}
      onCloseDialog={handleClose}
      title="Add themes"
      size="xl"
    >
      <Label>Add an existing theme</Label>
      <OutlinedInput
        placeholder="Search"
        value={searchTerm}
        onChange={setSearchTerm}
      />
      {availableThemes.length === 0 ? (
        <div className="py-4">
          <NoDataMessage loading={loading}>
            You haven&apos;t created any themes yet
          </NoDataMessage>
        </div>
      ) : (
        <ThemeOptions
          themes={filterAvailableThemes()}
          onToggle={handleThemeToggled}
          selectedThemes={themesToAdd}
        />
      )}

      <OrDivider />
      <div className="pb-4">
        <OutlinedInput
          placeholder="Ex: love, loss, hope"
          onChange={setNewTheme}
          label="Add a new theme"
          button="Create"
          value={newTheme}
          buttonLoading={creating}
          onButtonClick={handleCreateTheme}
        />
      </div>

      <FixedBottomMobile>
        <AddCancelActions
          onCancel={handleClose}
          onAdd={handleSaveThemes}
          loadingAdd={savingAdditions}
          addDisabled={themesToAdd?.length === 0}
        />
      </FixedBottomMobile>
    </StyledDialog>
  );
}
