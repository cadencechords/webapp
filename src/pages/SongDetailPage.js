import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import AddGenreDialog from "../components/AddGenreDialog";
import AddThemeDialog from "../components/AddThemeDialog";
import ArtistField from "../components/ArtistField";
import BinderColor from "../components/BinderColor";
import BpmField from "../components/BpmField";
import Button from "../components/Button";
import DetailSection from "../components/DetailSection";
import EyeIcon from "@heroicons/react/outline/EyeIcon";
import EyeOffIcon from "@heroicons/react/outline/EyeOffIcon";
import MeterField from "../components/MeterField";
import PageTitle from "../components/PageTitle";
import PencilIcon from "@heroicons/react/solid/PencilIcon";
import PlayIcon from "@heroicons/react/solid/PlayIcon";
import PrintSongDialog from "../components/PrintSongDialog";
import PrinterIcon from "@heroicons/react/outline/PrinterIcon";
import PulseLoader from "react-spinners/PulseLoader";
import SongApi from "../api/SongApi";
import SongKeyField from "../components/SongKeyField";
import SongOptionsPopover from "../components/SongOptionsPopover";
import SongPreview from "../components/SongPreview";
import TransposedKeyField from "../components/TransposedKeyField";
import { isEmpty } from "../utils/ObjectUtils";
import { setSongBeingEdited } from "../store/editorSlice";
import { setSongBeingPresented } from "../store/presenterSlice";
import { useDispatch } from "react-redux";

export default function SongDetailPage() {
	const [showPrintDialog, setShowPrintDialog] = useState(false);
	const [song, setSong] = useState();
	const [pendingUpdates, setPendingUpdates] = useState({});
	const [saving, setSaving] = useState(false);
	const [showAddThemeDialog, setShowAddThemeDialog] = useState(false);
	const [showAddGenreDialog, setShowGenreDialog] = useState(false);
	const [isTransposing, setIsTransposing] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => (document.title = song ? song.name : "Songs"));

	const router = useHistory();
	const { id } = useParams();

	const [showChordsDisabled, setShowChordsDisabled] = useState(() => {
		return localStorage.getItem(`show_chords_disabled_song_${id}`) === "true";
	});

	useEffect(() => {
		async function fetchSong() {
			try {
				let result = await SongApi.getOneById(id);
				result.data.showChordsDisabled =
					localStorage.getItem(`show_chords_disabled_song_${id}`) === "true";

				if (result.data.transposed_key) {
					setIsTransposing(true);
				}

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
			setSong((currentSong) => ({ ...currentSong, ...result.data }));
			setPendingUpdates({});
		} catch (error) {
			console.log(error);
		} finally {
			setSaving(false);
		}
	};

	const handlePresentSong = () => {
		dispatch(setSongBeingPresented(song));
		router.push(`/songs/${id}/present`);
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

	const handleShowChordsToggled = (toggleValue) => {
		setShowChordsDisabled(toggleValue);
		setSong({ ...song, showChordsDisabled: toggleValue });
		localStorage.setItem(`show_chords_disabled_song_${id}`, toggleValue);
	};

	const handleToggleTranspose = () => {
		setIsTransposing((currentlyTransposing) => !currentlyTransposing);
	};

	return (
		<div className="grid grid-cols-4">
			<div className="lg:border-r lg:pr-4 col-span-4 lg:col-span-3">
				<div className="flex-between mb-2">
					<PageTitle
						title={song.name}
						editable
						onChange={(editedName) => handleUpdate("name", editedName)}
					/>
					<Button
						size="xs"
						variant="open"
						color="gray"
						onClick={() => setShowPrintDialog(true)}
						className="hidden sm:block"
					>
						<PrinterIcon className="text-gray-500 h-5 w-5" />
					</Button>
					<SongOptionsPopover />
				</div>

				<PrintSongDialog
					song={song}
					open={showPrintDialog}
					onCloseDialog={() => setShowPrintDialog(false)}
				/>
				<div className="mb-3 justify-between items-center hidden sm:flex">
					<span className="flex-center">
						<Button variant="outlined" size="xs" color="black" onClick={handleOpenInEditor}>
							<div className="flex flex-row items-center">
								<span className="mr-1">
									<PencilIcon className="w-4 h-4 text-blue-700" />
								</span>
								Edit Song
							</div>
						</Button>

						<Button
							variant="outlined"
							size="xs"
							color="black"
							className="mx-3"
							onClick={handlePresentSong}
						>
							<div className="flex flex-row items-center">
								<span className="mr-1">
									<PlayIcon className="w-4 h-4 text-purple-700" />
								</span>
								Present Song
							</div>
						</Button>

						{song?.transposed_key && (
							<Button
								size="xs"
								color="purple"
								onClick={handleToggleTranspose}
								variant={isTransposing ? "open" : "filled"}
							>
								{isTransposing ? "Stop transposing" : "Transpose"}
							</Button>
						)}
					</span>
					<Button variant="open" onClick={() => handleShowChordsToggled(!showChordsDisabled)}>
						{showChordsDisabled ? (
							<EyeOffIcon className="h-5 text-gray-600" />
						) : (
							<EyeIcon className="h-5" />
						)}
					</Button>
				</div>
				<div className="flex sm:hidden justify-between mx-auto mb-4 gap-3">
					<Button
						variant="outlined"
						size="medium"
						color="black"
						className="flex-center gap-3"
						onClick={handleOpenInEditor}
						full
					>
						<PencilIcon className="h-5 w-5 text-blue-700" /> Edit
					</Button>
					<Button
						variant="outlined"
						size="medium"
						color="black"
						className="flex-center gap-3"
						onClick={handlePresentSong}
						full
					>
						<PlayIcon className="h-5 w-5 text-purple-700" /> Present
					</Button>

					{/* <Button
						variant="outlined"
						size="medium"
						color="black"
						className="flex-center flex-col"
						onClick={() => setShowPrintDialog(true)}
					>
						<PrinterIcon className="h-5 w-5 text-gray-600" /> Print
					</Button>

					<Button
						className="flex-center flex-col"
						variant="outlined"
						color="black"
						size="medium"
						onClick={() => handleShowChordsToggled(!showChordsDisabled)}
					>
						{showChordsDisabled ? (
							<EyeOffIcon className="h-5 text-gray-600" />
						) : (
							<EyeIcon className="h-5 text-blue-700" />
						)}
						Chords
					</Button> */}
				</div>
				<SongPreview song={song} transpose={isTransposing} />
			</div>
			<div className="lg:col-span-1 lg:pl-5 pl-2 col-span-4">
				<div className="border-b py-6 mt-1">
					<SongKeyField
						songKey={song.original_key}
						onChange={(editedKey) => handleUpdate("original_key", editedKey)}
					/>
					<TransposedKeyField
						transposedKey={song.transposed_key}
						originalKey={song.original_key}
						onChange={(editedKey) => handleUpdate("transposed_key", editedKey)}
						content={song.content}
					/>
					<ArtistField
						artist={song.artist}
						onChange={(editedArtist) => handleUpdate("artist", editedArtist)}
					/>
					<BpmField bpm={song.bpm} onChange={(editedBpm) => handleUpdate("bpm", editedBpm)} />
					<MeterField
						meter={song.meter}
						onChange={(editedMeter) => handleUpdate("meter", editedMeter)}
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
				<Button
					bold
					onClick={handleSaveChanges}
					loading={saving}
					className="fixed bottom-16 right-4 md:right-6 md:bottom-6"
				>
					Save Changes
				</Button>
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
