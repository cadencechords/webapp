import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import AddGenreDialog from "../components/AddGenreDialog";
import AddThemeDialog from "../components/AddThemeDialog";
import ArtistField from "../components/ArtistField";
import BinderColor from "../components/BinderColor";
import BpmField from "../components/BpmField";
import Button from "../components/Button";
import DetailSection from "../components/DetailSection";
import { EDIT_SONGS } from "../utils/constants";
import EyeIcon from "@heroicons/react/outline/EyeIcon";
import EyeOffIcon from "@heroicons/react/outline/EyeOffIcon";
import { Link } from "react-router-dom";
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
import { selectCurrentMember } from "../store/authSlice";
import { setSongBeingEdited } from "../store/editorSlice";
import { setSongBeingPresented } from "../store/presenterSlice";

export default function SongDetailPage() {
	const [showPrintDialog, setShowPrintDialog] = useState(false);
	const [song, setSong] = useState();
	const [pendingUpdates, setPendingUpdates] = useState({});
	const [saving, setSaving] = useState(false);
	const [showAddThemeDialog, setShowAddThemeDialog] = useState(false);
	const [showAddGenreDialog, setShowGenreDialog] = useState(false);
	const dispatch = useDispatch();
	const currentMember = useSelector(selectCurrentMember);

	useEffect(() => (document.title = song ? song.name : "Songs"));

	const router = useHistory();
	const { id } = useParams();

	useEffect(() => {
		async function fetchSong() {
			try {
				let { data } = await SongApi.getOneById(id);

				setSong({ ...data, show_transposed: Boolean(data.transposed_key) });
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
		if (currentMember.can(EDIT_SONGS)) {
			dispatch(setSongBeingEdited(song));
			router.push("/editor");
		}
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
			<Link to={`/binders/${binder.id}`}>
				<div className="flex items-center">
					<BinderColor color={binder.color} size={3} />
					<span className="ml-2">{binder.name}</span>
				</div>
			</Link>
		),
	}));

	function handleUpdateSong(field, value) {
		setSong((currentSong) => ({ ...currentSong, [field]: value }));
	}

	function handleUpdateFormat(field, value) {
		setSong((currentSong) => {
			let updatedFormat = { ...currentSong.format };
			updatedFormat[field] = value;
			return { ...currentSong, format: updatedFormat };
		});
	}

	return (
		<div className="grid grid-cols-4">
			<div className="lg:border-r lg:pr-4 col-span-4 lg:col-span-3">
				<div className="flex-between mb-2">
					<PageTitle
						title={song.name}
						editable={currentMember.can(EDIT_SONGS)}
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
					<SongOptionsPopover onPrintClick={() => setShowPrintDialog(true)} />
				</div>

				<PrintSongDialog
					song={song}
					open={showPrintDialog}
					onCloseDialog={() => setShowPrintDialog(false)}
				/>
				<div className="mb-3 justify-between items-center hidden sm:flex">
					<span className="flex-center">
						{currentMember.can(EDIT_SONGS) && (
							<Button variant="outlined" size="xs" color="black" onClick={handleOpenInEditor}>
								<div className="flex flex-row items-center">
									<span className="mr-1">
										<PencilIcon className="w-4 h-4 text-blue-700" />
									</span>
									Edit Song
								</div>
							</Button>
						)}

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
								onClick={() => handleUpdateSong("show_transposed", !song.show_transposed)}
								variant={song.show_transposed ? "open" : "filled"}
							>
								{song.show_transposed ? "Stop transposing" : "Transpose"}
							</Button>
						)}
					</span>
					<Button
						variant="open"
						onClick={() => handleUpdateFormat("chords_hidden", !song?.format?.chords_hidden)}
					>
						{song?.format?.chords_hidden ? (
							<EyeOffIcon className="h-5 text-gray-600" />
						) : (
							<EyeIcon className="h-5" />
						)}
					</Button>
				</div>
				<div className="flex sm:hidden justify-between mx-auto mb-4 gap-3">
					{currentMember.can(EDIT_SONGS) && (
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
					)}
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
				</div>
				<SongPreview song={song} onDoubleClick={handleOpenInEditor} />
			</div>
			<div className="lg:col-span-1 lg:pl-5 pl-2 col-span-4">
				<div className="border-b py-6 mt-1">
					<SongKeyField
						songKey={song.original_key}
						onChange={(editedKey) => handleUpdate("original_key", editedKey)}
						editable={currentMember.can(EDIT_SONGS)}
					/>
					<TransposedKeyField
						transposedKey={song.transposed_key}
						originalKey={song.original_key}
						onChange={(editedKey) => handleUpdate("transposed_key", editedKey)}
						content={song.content}
						editable={currentMember.can(EDIT_SONGS)}
					/>
					<ArtistField
						artist={song.artist}
						onChange={(editedArtist) => handleUpdate("artist", editedArtist)}
						editable={currentMember.can(EDIT_SONGS)}
					/>
					<BpmField
						bpm={song.bpm}
						onChange={(editedBpm) => handleUpdate("bpm", editedBpm)}
						editable={currentMember.can(EDIT_SONGS)}
					/>
					<MeterField
						meter={song.meter}
						onChange={(editedMeter) => handleUpdate("meter", editedMeter)}
						editable={currentMember.can(EDIT_SONGS)}
					/>
				</div>
				<div className="py-6">
					<DetailSection title="Binders" items={bindersTags} />
					<DetailSection
						title="Genres"
						items={song.genres}
						onAdd={() => setShowGenreDialog(true)}
						onDelete={handleRemoveGenre}
						canEdit={currentMember.can(EDIT_SONGS)}
					/>
					<DetailSection
						title="Themes"
						items={song.themes}
						onAdd={() => setShowAddThemeDialog(true)}
						onDelete={handleRemoveTheme}
						canEdit={currentMember.can(EDIT_SONGS)}
					/>
				</div>
			</div>
			{currentMember.can(EDIT_SONGS) && !isEmpty(pendingUpdates) && (
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
