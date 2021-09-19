import { ADD_SONGS } from "../utils/constants";
import OnsongApi from "../api/onsongApi";
import OnsongChooseBackupFile from "../components/OnsongChooseBackupFile";
import OnsongChooseBinderForSongs from "../components/OnsongChooseBinderForSongs";
import OnsongChooseSongsFromBackup from "../components/OnsongChooseSongsFromBackup";
import OnsongImportStatus from "../components/OnsongImportStatus";
import OnsongReviewImport from "../components/OnsongReviewImport";
import PageTitle from "../components/PageTitle";
import { selectCurrentMember } from "../store/authSlice";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function OnsongImportPage() {
	const [backup, setBackup] = useState();
	const [unzippedFiles, setUnzippedFiles] = useState();
	const [selectedSongs, setSelectedSongs] = useState([]);
	const [importing, setImporting] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [errors, setErrors] = useState();
	const [wizardStep, setWizardStep] = useState(0);
	const [binders, setBinders] = useState();
	const [importId, setImportId] = useState();
	const [selectedBinder, setSelectedBinder] = useState();
	const router = useHistory();
	const currentMember = useSelector(selectCurrentMember);

	if (!currentMember.can(ADD_SONGS)) {
		router.push("/songs");
	}

	const handleBackupFileChosen = async (backup) => {
		setBackup(backup);
		try {
			setUploading(true);
			handleNextStep();
			let { data } = await OnsongApi.unzip(backup);
			setUnzippedFiles(data.files);
			setImportId(data.id);
		} catch (error) {
			console.log(error);
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

	const handleSongToggled = (selected, toggledSong) => {
		if (selected) {
			setSelectedSongs((currentSelection) => [...currentSelection, toggledSong]);
		} else {
			setSelectedSongs((currentSelection) =>
				currentSelection.filter((songInCurrentSelection) => songInCurrentSelection !== toggledSong)
			);
		}
	};

	const handleConfirmImport = async () => {
		try {
			handleNextStep();
			setImporting(true);
			await OnsongApi.import(selectedSongs, selectedBinder?.id), importId;
		} catch (error) {
			console.log(error);
			setErrors(error.response.data?.errors);
		} finally {
			setImporting(false);
		}
	};

	const handleNextStep = () => {
		setWizardStep((current) => current + 1);
	};

	const handleBackStep = () => {
		if (wizardStep === 0) {
			router.push("/import");
		}
		setWizardStep((current) => current - 1);
	};

	const handleSelectBinder = (binder) => {
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
						onSelectAll={() => setSelectedSongs(unzippedFiles)}
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
				return <OnsongImportStatus importing={importing} errors={errors} onReset={handleReset} />;
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
