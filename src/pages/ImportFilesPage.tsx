import ImportFilesSelection from '../components/ImportFilesSelection';
import ImportFilesStatus from '../components/ImportFilesStatus';
import ImportsApi from '../api/importsApi';
import { useState } from 'react';

type ImportStatus = {
  importing: boolean;
  importClicked: boolean;
  /** The import's error messages, one per file that failed. */
  errors: string[];
};

export default function ImportFilesPage() {
  const [filesToImport, setFilesToImport] = useState<File[]>([]);
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    importing: false,
    importClicked: false,
    errors: [],
  });

  function handleReset() {
    setImportStatus({ importing: false, importClicked: false, errors: [] });
    setFilesToImport([]);
  }

  async function handleImportSongs() {
    try {
      setImportStatus(current => ({
        ...current,
        importClicked: true,
        importing: true,
      }));
      await ImportsApi.import(filesToImport);
    } catch (error) {
      // ImportsApi.import rejects with an axios error, and the API responds to a
      // failed import with its error messages. As before, this throws if there
      // was no response.
      setImportStatus(current => ({
        ...current,
        errors: (error as { response: { data: string[] } }).response.data,
      }));
    } finally {
      setImportStatus(current => ({ ...current, importing: false }));
    }
  }

  return (
    <>
      {importStatus.importClicked ? (
        <ImportFilesStatus
          loading={importStatus.importing}
          errors={importStatus.errors}
          onReset={handleReset}
        />
      ) : (
        <ImportFilesSelection
          filesToImport={filesToImport}
          onFilesChange={setFilesToImport}
          onImport={handleImportSongs}
        />
      )}
    </>
  );
}
