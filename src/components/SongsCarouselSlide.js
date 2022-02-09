import { useCallback, useState } from "react";

import NotesList from "./NotesList";
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

	function onDeleteNote(noteId) {
		let updatedNotes = notes?.filter((note) => note.id !== noteId);

		setNotes(updatedNotes);
		debounce("notes", updatedNotes);
	}

	return (
		<div key={song?.id} className="mb-4 block">
			<div className="relative w-full">
				{currentSubscription?.isPro && song.notes?.length > 0 && (
					<NotesList rearrangeable={false} song={song} onDelete={onDeleteNote} />
				)}
				<Roadmap
					song={{ id: song.id, roadmap: roadmap }}
					onSongChange={handleRoadmapUpdate}
					onDragEnd={onEnableSwipe}
					onDragStart={onDisableSwipe}
				/>
				<div id="song" className="mr-0">
					{html(song)}
				</div>
			</div>
		</div>
	);
}
