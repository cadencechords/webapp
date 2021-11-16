import "react-alice-carousel/lib/alice-carousel.css";

import AliceCarousel from "react-alice-carousel";
import NotesDragDropContext from "./NotesDragDropContext";
import { determineFret } from "../utils/capo";
import { html } from "../utils/SongUtils";
import { selectCurrentSubscription } from "../store/subscriptionSlice";
import { useSelector } from "react-redux";

export default function SongsCarousel({ songs, index, onIndexChange, onSongUpdate }) {
	const currentSubscription = useSelector(selectCurrentSubscription);

	function buildTemplates() {
		return songs?.map((song) => (
			<div key={song?.id} className="mb-4 block">
				{song.capo && (
					<p className="mb-4 p-2 rounded-md bg-gray-100 font-medium">
						Capo:
						<span className="ml-2">
							{determineFret(
								(song.show_transposed && song.transposed_key) || song.original_key,
								song.capo.capo_key
							)}
						</span>
					</p>
				)}
				<div className={`relative ${song?.format?.autosize ? "" : "inline-block"}`}>
					<div className={`mr-0 ${song?.notes?.length > 0 ? "md:mr-72" : ""}`}>{html(song)}</div>
					{currentSubscription.isPro && song.notes?.length > 0 && (
						<div className="hidden md:absolute top-0 right-0 md:flex md:w-64">
							<NotesDragDropContext
								song={song}
								onUpdateNote={handleUpdateNote}
								rearrangable={false}
								onDeleteNote={handleDeleteNote}
							/>
						</div>
					)}
				</div>
			</div>
		));
	}

	function handleUpdateNote(noteId, updates) {
		let updatedNotes = songs[index].notes?.map((note) => {
			if (note.id === noteId) {
				return { ...note, ...updates };
			} else {
				return note;
			}
		});

		onSongUpdate("notes", updatedNotes);
	}

	function handleDeleteNote(noteId) {
		let updatedNotes = songs[index].notes?.filter((note) => note.id !== noteId);

		onSongUpdate("notes", updatedNotes);
	}

	return (
		<>
			<AliceCarousel
				mouseTracking
				disableButtonsControls
				disableDotsControls
				disableSlideInfo
				items={buildTemplates()}
				onSlideChanged={(e) => onIndexChange(e.slide)}
				activeIndex={index}
				swipeDelta={100}
				autoHeight
				animationDuration={400}
			/>
		</>
	);
}
