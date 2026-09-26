import { ADD_SONGS } from '../utils/constants';
import OnsongApi from '../api/onsongApi';
import OnsongChooseBackupFile from '../components/OnsongChooseBackupFile';
import OnsongChooseBinderForSongs from '../components/OnsongChooseBinderForSongs';
import OnsongChooseSongsFromBackup from '../components/OnsongChooseSongsFromBackup';
import OnsongImportStatus from '../components/OnsongImportStatus';
import OnsongReviewImport from '../components/OnsongReviewImport';
import PageTitle from '../components/PageTitle';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import type { Binder, OnsongFile } from '../types';

export default function OnsongImportPage() {
  const [backup, setBackup] = useState<File | null>();
  const [unzippedFiles, setUnzippedFiles] = useState<
    OnsongFile[] | null | undefined
  >(undefined);
  const [selectedSongs, setSelectedSongs] = useState<OnsongFile[]>([]);
  const [importing, setImporting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<string[]>();
  const [wizardStep, setWizardStep] = useState(0);
  const [binders, setBinders] = useState<Binder[]>();
  const [importId, setImportId] = useState<number | null | undefined>(
    undefined
  );
  const [selectedBinder, setSelectedBinder] = useState<
    Binder | null | undefined
  >(undefined);
  const router = useHistory();
  const currentMember = useSelector(selectCurrentMember);

  // Non-null: kept as before, this throws if the page renders before the
  // membership loads.
  if (!currentMember!.can(ADD_SONGS)) {
    router.push('/songs');
  }

  const handleBackupFileChosen = async (backup: File) => {
    setBackup(backup);
    try {
      setUploading(true);
      handleNextStep();
      const { data } = await OnsongApi.unzip(backup);
      setUnzippedFiles(data.files);
      setImportId(data.id);
    } catch (error) {
      reportError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setBackup(null);
    setUnzippedFiles(null);
    setSelectedSongs([]);
    setWizardStep(0);
    setSelectedBinder(null);
    setImportId(null);
  };

  const handleSongToggled = (selected: boolean, toggledSong: OnsongFile) => {
    if (selected) {
      setSelectedSongs(currentSelection => [...currentSelection, toggledSong]);
    } else {
      setSelectedSongs(currentSelection =>
        currentSelection.filter(
          songInCurrentSelection => songInCurrentSelection !== toggledSong
        )
      );
    }
  };

  const handleConfirmImport = async () => {
    try {
      handleNextStep();
      setImporting(true);
      // Non-null: songs can only be chosen once the backup is unzipped, which
      // sets importId, so it's set by the time the import is confirmed.
      await OnsongApi.import(selectedSongs, selectedBinder?.id, importId!);
    } catch (error) {
      reportError(error);
      // OnsongApi.import rejects with an axios error, and the API lists the
      // songs it couldn't import in `errors`. As before, this throws if there
      // was no response.
      setErrors(
        (error as { response: { data?: { errors?: string[] } } }).response.data
          ?.errors
      );
    } finally {
      setImporting(false);
    }
  };

  const handleNextStep = () => {
    setWizardStep(current => current + 1);
  };

  const handleBackStep = () => {
    if (wizardStep === 0) {
      router.push('/import');
    }
    setWizardStep(current => current - 1);
  };

  const handleSelectBinder = (binder: Binder) => {
    if (selectedBinder === binder) {
      setSelectedBinder(null);
    } else {
      setSelectedBinder(binder);
    }
  };

  const getWizardPage = () => {
    switch (wizardStep) {
      case 0:
        return (
          <OnsongChooseBackupFile
            onBackupFileChosen={handleBackupFileChosen}
            onReset={handleReset}
            backup={backup}
            onChooseSongs={handleNextStep}
            onCancel={handleBackStep}
          />
        );
      case 1:
        return (
          <OnsongChooseSongsFromBackup
            uploading={uploading}
            // Non-null: "Check all" only shows once the list of unzipped
            // files does.
            onSelectAll={() => setSelectedSongs(unzippedFiles!)}
            onUnselectAll={() => setSelectedSongs([])}
            onSongToggled={handleSongToggled}
            importing={importing}
            unzippedFiles={unzippedFiles}
            selectedSongs={selectedSongs}
            onBackClick={handleBackStep}
            onConfirmSongSelection={handleNextStep}
          />
        );
      case 2:
        return (
          <OnsongChooseBinderForSongs
            binders={binders}
            onBindersLoaded={setBinders}
            onSelectBinder={handleSelectBinder}
            selectedBinder={selectedBinder}
            onBackClick={handleBackStep}
            onNextClick={handleNextStep}
          />
        );
      case 3:
        return (
          <OnsongReviewImport
            selectedBinder={selectedBinder}
            selectedSongs={selectedSongs}
            onBackClick={handleBackStep}
            onConfirm={handleConfirmImport}
          />
        );
      case 4:
        return (
          <OnsongImportStatus
            importing={importing}
            errors={errors}
            onReset={handleReset}
          />
        );
      default:
        return (
          <OnsongChooseBackupFile
            onBackupFileChosen={handleBackupFileChosen}
            onReset={handleReset}
            backup={backup}
            onChooseSongs={handleNextStep}
            onCancel={handleBackStep}
          />
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageTitle title="Import from Onsong" align="center" className="my-5" />
      {getWizardPage()}
    </div>
  );
}
