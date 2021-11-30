import { useCallback, useState } from "react";

import NotesDragDropContext from "./NotesDragDropContext";
import Roadmap from "./Roadmap";
import _ from "lodash";
import { html } from "../utils/SongUtils";
import { selectCurrentSubscription } from "../store/subscriptionSlice";
import { useSelector } from "react-redux";

export default function SongsCarouselSlide({ song, onDisableSwipe, onEnableSwipe, onSongUpdate }) {
	const currentSubscription = useSelector(selectCurrentSubscription);
	const [roadmap, setRoadmap] = useState(() => song.roadmap);
	const [notes, setNotes] = useState(() => song.notes);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debounce = useCallback(
		_.debounce((field, updatedValue) => {
			onSongUpdate(field, updatedValue);
		}, 200),
		[onSongUpdate]
	);

	function handleRoadmapUpdate(field, updatedRoadmap) {
		setRoadmap(updatedRoadmap);
		debounce("roadmap", updatedRoadmap);
	}

	function onUpdateNote(noteId, updates) {
		let updatedNotes = notes?.map((note) => {
			if (note.id === noteId) {
				return { ...note, ...updates };
			} else {
				return note;
			}
		});

		setNotes(updatedNotes);
		debounce("notes", updatedNotes);
	}

	function onDeleteNote(noteId) {
		let updatedNotes = notes?.filter((note) => note.id !== noteId);

		setNotes(updatedNotes);
		debounce("notes", updatedNotes);
	}

	return (
		<div key={song?.id} className="mb-4 block">
			<Roadmap
				song={{ id: song.id, roadmap: roadmap }}
				onSongChange={handleRoadmapUpdate}
				onDragEnd={onEnableSwipe}
				onDragStart={onDisableSwipe}
			/>
			<div className={`relative ${song?.format?.autosize ? "" : "inline-block"}`}>
				<div className={`mr-0 ${song?.notes?.length > 0 ? "md:mr-72" : ""}`}>{html(song)}</div>
				{currentSubscription.isPro && song.notes?.length > 0 && (
					<div className="hidden md:absolute top-0 right-0 md:flex md:w-64">
						<NotesDragDropContext
							song={{ notes, id: song.id, format: song.format, content: song.content }}
							onUpdateNote={onUpdateNote}
							rearrangable={false}
							onDeleteNote={onDeleteNote}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
