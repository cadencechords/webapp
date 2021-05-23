import OpenButton from "./buttons/OpenButton";
import StyledDialog from "./StyledDialog";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { toPdf } from "../utils/SongUtils";
import { useState } from "react";
import FilledButton from "./buttons/FilledButton";

export default function PrintSongDialog({ song, open, onCloseDialog }) {
	const [lyricsAndChordsClicked, setLyricsAndChordsClicked] = useState(false);
	const [lyricsClicked, setLyricsClicked] = useState(false);

	let printLyrics = null;

	if (lyricsClicked) {
		printLyrics = (
			<PDFDownloadLink document={toPdf(song, false)} fileName={`${song.name} Lyrics.pdf`}>
				{({ blob, url, loading, error }) => (
					<FilledButton full loading={!blob} disabled={!blob}>
						Download Now
					</FilledButton>
				)}
			</PDFDownloadLink>
		);
	} else {
		printLyrics = (
			<OpenButton full onClick={() => setLyricsClicked(true)}>
				Print lyrics only
			</OpenButton>
		);
	}

	let printLyricsAndChords = null;

	if (lyricsAndChordsClicked) {
		printLyricsAndChords = (
			<PDFDownloadLink document={toPdf(song, true)} fileName={`${song.name} Lyrics and Chords.pdf`}>
				{({ blob, url, loading, error }) => (
					<FilledButton full loading={!blob} disabled={!blob}>
						Download Now
					</FilledButton>
				)}
			</PDFDownloadLink>
		);
	} else {
		printLyricsAndChords = (
			<OpenButton full onClick={() => setLyricsAndChordsClicked(true)}>
				Print lyrics and chords
			</OpenButton>
		);
	}

	const handleCloseDialog = () => {
		setLyricsAndChordsClicked(false);
		setLyricsClicked(false);
		onCloseDialog();
	};

	return (
		<StyledDialog
			open={open}
			onCloseDialog={handleCloseDialog}
			size="xs"
			title="Printing"
			overlayOpacity={30}
		>
			<div className="mb-2">{printLyrics}</div>
			<div className="mb-4">{printLyricsAndChords}</div>

			<div className="flex justify-end">
				<OpenButton bold color="blue" onClick={handleCloseDialog}>
					Cancel
				</OpenButton>
			</div>
		</StyledDialog>
	);
}
