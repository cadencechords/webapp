import "react-alice-carousel/lib/alice-carousel.css";

import { useEffect, useState } from "react";

import AliceCarousel from "react-alice-carousel";
import NotesDragDropContext from "./NotesDragDropContext";
import PageTitle from "./PageTitle";
import PerformSetlistSongAdjustmentsDrawer from "./PerformSetlistSongAdjustmentsDrawer";
import { html } from "../utils/SongUtils";
import { selectCurrentSubscription } from "../store/subscriptionSlice";
import { useSelector } from "react-redux";

export default function SongsCarousel({ songs, index, onIndexChange }) {
	const [enrichedSongs, setEnrichedSongs] = useState(songs);
	const currentSubscription = useSelector(selectCurrentSubscription);

	useEffect(() => {
		setEnrichedSongs(
			songs.map((song) => ({ ...song, show_transposed: Boolean(song.transposed_key) }))
		);
	}, [songs]);

	function handleUpdateFormat(field, value) {
		setEnrichedSongs((currentSongs) => {
			return currentSongs.map((song) => {
				if (song.id === enrichedSongs[index].id) {
					let updatedFormat = { ...song.format, [field]: value };
					return { ...song, format: updatedFormat };
				} else {
					return song;
				}
			});
		});
	}

	function handleUpdateSong(field, value) {
		setEnrichedSongs((currentSongs) => {
			return currentSongs.map((song) => {
				if (song.id === enrichedSongs[index].id) {
					return { ...song, [field]: value };
				} else {
					return song;
				}
			});
		});
	}

	function buildTemplates() {
		return enrichedSongs?.map((song) => (
			<div key={song?.id} className="mb-4">
				<PageTitle title={song?.name} className="my-4" />
				<div className="flex">
					<div>{html(song)}</div>
					{currentSubscription.isPro && (
						<div className="ml-4">
							<NotesDragDropContext
								song={song}
								onUpdateNote={(noteId, updates) => handleUpdateNote(song, noteId, updates)}
								rearrangable={false}
								onDeleteNote={(noteId) => handleDeleteNote(song, noteId)}
							/>
						</div>
					)}
				</div>
			</div>
		));
	}

	function handleUpdateNote(song, noteId, updates) {
		setEnrichedSongs((currentEnrichedSongs) => {
			return currentEnrichedSongs.map((enrichedSong) => {
				if (enrichedSong.id === song.id) {
					let updatedNotes = enrichedSong.notes?.map((note) => {
						if (note.id === noteId) {
							return { ...note, ...updates };
						} else {
							return note;
						}
					});

					return { ...enrichedSong, notes: updatedNotes };
				} else {
					return enrichedSong;
				}
			});
		});
	}

	function handleDeleteNote(song, noteId) {
		setEnrichedSongs((currentEnrichedSongs) => {
			return currentEnrichedSongs.map((enrichedSong) => {
				if (enrichedSong.id === song.id) {
					let updatedNotes = enrichedSong.notes?.filter((note) => note.id !== noteId);
					return { ...enrichedSong, notes: updatedNotes };
				} else {
					return enrichedSong;
				}
			});
		});
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
				swipeDelta={70}
				autoHeight
				animationDuration={400}
			/>

			<PerformSetlistSongAdjustmentsDrawer
				song={enrichedSongs[index]}
				onFormatUpdate={handleUpdateFormat}
				onSongUpdate={handleUpdateSong}
			/>
		</>
	);
}
