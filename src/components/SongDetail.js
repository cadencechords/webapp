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
import { isEmpty } from "../utils/ObjectUtils";
import AddThemeDialog from "./AddThemeDialog";
import AddGenreDialog from "./AddGenreDialog";
import BinderColor from "./BinderColor";
import { setSongBeingEdited } from "../store/editorSlice";
import { useDispatch } from "react-redux";
import Button from "./Button";

export default function SongDetail() {
	const [showPrintDialog, setShowPrintDialog] = useState(false);
	const [song, setSong] = useState();
	const [pendingUpdates, setPendingUpdates] = useState({});
	const [saving, setSaving] = useState(false);
	const [showAddThemeDialog, setShowAddThemeDialog] = useState(false);
	const [showAddGenreDialog, setShowGenreDialog] = useState(false);

	useEffect(() => (document.title = song ? song.name : "Songs"));

	const router = useHistory();
	const { id } = useParams();
	const dispatch = useDispatch();

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
		dispatch(setSongBeingEdited(song));
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

	const handleGenresAdded = (newGenres) => {
		setSong({ ...song, genres: song.genres.concat(newGenres) });
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

	const handleRemoveGenre = async (genreIdToRemove) => {
		try {
			await SongApi.removeGenres(song.id, [genreIdToRemove]);
			let newGenresList = song.genres.filter((genreInList) => genreInList.id !== genreIdToRemove);
			setSong({ ...song, genres: newGenresList });
		} catch (error) {
			console.log(error);
		}
	};

	const bindersTags = song?.binders?.map((binder) => ({
		id: binder.id,
		name: (
			<div className="flex items-center">
				<BinderColor color={binder.color} size={3} />
				<span className="ml-2">{binder.name}</span>
			</div>
		),
	}));

	return (
		<div className="grid grid-cols-4">
			<div className="md:border-r md:pr-4 col-span-4 md:col-span-3">
				<div className="flex items-center justify-between">
					<PageTitle
						title={song.name}
						editable
						onChange={(editedName) => handleUpdate("name", editedName)}
					/>
					<Button size="xs" variant="open" color="gray" onClick={() => setShowPrintDialog(true)}>
						<PrinterIcon className="text-gray-500 h-5 w-5" />
					</Button>
				</div>

				<PrintSongDialog
					song={song}
					open={showPrintDialog}
					onCloseDialog={() => setShowPrintDialog(false)}
				/>
				<div className="mb-3">
					<Button variant="outlined" size="xs" color="black" onClick={handleOpenInEditor}>
						<div className="flex flex-row items-center">
							<span className="mr-1">
								<PencilIcon className="w-4 h-4 text-blue-700" />
							</span>
							Edit Song
						</div>
					</Button>
				</div>
				<SongPreview song={song} />
			</div>
			<div className="md:col-span-1 md:pl-5 pl-2 col-span-4">
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
					<DetailSection title="Binders" items={bindersTags} />
					<DetailSection
						title="Genres"
						items={song.genres}
						onAdd={() => setShowGenreDialog(true)}
						onDelete={handleRemoveGenre}
					/>
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
					<Button bold onClick={handleSaveChanges} loading={saving}>
						Save Changes
					</Button>
				</div>
			)}

			<AddGenreDialog
				open={showAddGenreDialog}
				currentSong={song}
				onCloseDialog={() => setShowGenreDialog(false)}
				onGenresAdded={handleGenresAdded}
			/>

			<AddThemeDialog
				open={showAddThemeDialog}
				onCloseDialog={() => setShowAddThemeDialog(false)}
				currentSong={song}
				onThemesAdded={handleThemesAdded}
			/>
		</div>
	);
}
