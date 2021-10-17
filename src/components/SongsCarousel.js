import "react-alice-carousel/lib/alice-carousel.css";

import { useEffect, useState } from "react";

import AliceCarousel from "react-alice-carousel";
import PageTitle from "./PageTitle";
import PerformSetlistSongAdjustmentsDrawer from "./PerformSetlistSongAdjustmentsDrawer";
import { html } from "../utils/SongUtils";

export default function SongsCarousel({ songs, index, onIndexChange }) {
	const [enrichedSongs, setEnrichedSongs] = useState(songs);

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
			<div key={song?.id}>
				<PageTitle title={song?.name} className="my-4" />
				{html(song)}
			</div>
		));
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
				swipeDelta="400px"
			/>

			<PerformSetlistSongAdjustmentsDrawer
				song={enrichedSongs[index]}
				onFormatUpdate={handleUpdateFormat}
				onSongUpdate={handleUpdateSong}
			/>
		</>
	);
}
