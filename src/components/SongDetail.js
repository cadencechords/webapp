import OpenButton from "./buttons/OpenButton";
import OutlinedButton from "./buttons/OutlinedButton";
import PageTitle from "./PageTitle";
import PrinterIcon from "@heroicons/react/outline/PrinterIcon";
import PrintSongDialog from "./PrintSongDialog";
import { useEffect, useState } from "react";
import DetailSection from "./DetailSection";
import ArtistField from "./ArtistField";
import BpmField from "./BpmField";
import MeterField from "./MeterField";
import SongKeyField from "./SongKeyField";
import SongPreview from "./SongPreview";
import PencilIcon from "@heroicons/react/solid/PencilIcon";
import { useHistory, useParams } from "react-router";
import PulseLoader from "react-spinners/PulseLoader";
import SongApi from "../api/SongApi";
import FilledButton from "./buttons/FilledButton";
import { isEmpty } from "../utils/ObjectUtils";
import AddThemeDialog from "./AddThemeDialog";

export default function SongDetail() {
	const [showPrintDialog, setShowPrintDialog] = useState(false);
	const [song, setSong] = useState();
	const [pendingUpdates, setPendingUpdates] = useState({});
	const [saving, setSaving] = useState(false);
	const [showAddThemeDialog, setShowAddThemeDialog] = useState(false);
	const router = useHistory();
	const { id } = useParams();

	useEffect(() => {
		async function fetchSong() {
			try {
				let result = await SongApi.getOneById(id);
				setSong(result.data);
			} catch (error) {
				console.log(error);
			}
		}

		fetchSong();
	}, [id]);

	if (!song) {
		return (
			<div className="text-center py-4">
				<PulseLoader color="blue" />
			</div>
		);
	}

	const handleOpenInEditor = () => {
		router.push("/editor");
	};

	const handleUpdate = (field, value) => {
		let updates = { ...pendingUpdates };
		updates[field] = value;
		setPendingUpdates(updates);

		let updatedSong = { ...song };
		updatedSong[field] = value;
		setSong(updatedSong);
	};

	const handleSaveChanges = async () => {
		setSaving(true);
		try {
			let result = await SongApi.updateOneById(id, pendingUpdates);
			setSong(result.data);
			setPendingUpdates({});
		} catch (error) {
			console.log(error);
		} finally {
			setSaving(false);
		}
	};

	const handleThemesAdded = (newThemes) => {
		setSong({ ...song, themes: song.themes.concat(newThemes) });
	};

	const handleRemoveTheme = async (themeIdToRemove) => {
		try {
			await SongApi.removeThemes(song.id, [themeIdToRemove]);
			let newThemesList = song.themes.filter((themeInList) => themeInList.id !== themeIdToRemove);
			setSong({ ...song, themes: newThemesList });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="grid grid-cols-4">
			<div className="md:border-r md:pr-4 col-span-4 md:col-span-3">
				<div className="flex items-center justify-between">
					<PageTitle
						title={song.name}
						editable
						onChange={(editedName) => handleUpdate("name", editedName)}
					/>
					<OpenButton onClick={() => setShowPrintDialog(true)}>
						<PrinterIcon className="text-gray-500 h-5 w-5" />
					</OpenButton>
				</div>

				<PrintSongDialog open={showPrintDialog} onCloseDialog={() => setShowPrintDialog(false)} />
				<div className="mb-3">
					<OutlinedButton onClick={handleOpenInEditor}>
						<div className="flex flex-row items-center">
							<span className="mr-1">
								<PencilIcon className="w-4 h-4 text-blue-700" />
							</span>
							Edit Song
						</div>
					</OutlinedButton>
				</div>
				<SongPreview />
			</div>
			<div className="md:col-span-1 md:pl-5 pl-2">
				<div className="border-b py-6 mt-1">
					<ArtistField
						artist={song.artist}
						onChange={(editedArtist) => handleUpdate("artist", editedArtist)}
					/>
					<BpmField bpm={song.bpm} onChange={(editedBpm) => handleUpdate("bpm", editedBpm)} />
					<MeterField
						meter={song.meter}
						onChange={(editedMeter) => handleUpdate("meter", editedMeter)}
					/>
					<SongKeyField
						songKey={song.key}
						onChange={(editedKey) => handleUpdate("key", editedKey)}
					/>
				</div>
				<div className="py-6">
					<DetailSection title="Binders" />
					<DetailSection title="Genres" items={song.genres} />
					<DetailSection
						title="Themes"
						items={song.themes}
						onAdd={() => setShowAddThemeDialog(true)}
						onDelete={handleRemoveTheme}
					/>
				</div>
			</div>

			{!isEmpty(pendingUpdates) && (
				<div className="fixed bottom-8 right-8 shadow-md">
					<FilledButton bold onClick={handleSaveChanges} loading={saving}>
						Save Changes
					</FilledButton>
				</div>
			)}

			<AddThemeDialog
				open={showAddThemeDialog}
				onCloseDialog={() => setShowAddThemeDialog(false)}
				currentSong={song}
				onThemesAdded={handleThemesAdded}
			/>
		</div>
	);
}
