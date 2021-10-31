import ImportFilesSelection from "../components/ImportFilesSelection";
import ImportFilesStatus from "../components/ImportFilesStatus";
import ImportsApi from "../api/importsApi";
import { useState } from "react";

export default function ImportFilesPage() {
	const [filesToImport, setFilesToImport] = useState([]);
	const [importStatus, setImportStatus] = useState({
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
			setImportStatus((current) => ({ ...current, importClicked: true, importing: true }));
			await ImportsApi.import(filesToImport);
		} catch (error) {
			setImportStatus((current) => ({ ...current, errors: error.response.data }));
		} finally {
			setImportStatus((current) => ({ ...current, importing: false }));
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
