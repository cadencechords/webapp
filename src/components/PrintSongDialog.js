import StyledDialog from "./StyledDialog";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { toPdf } from "../utils/PdfUtils";
import { useState } from "react";
import Button from "./Button";

export default function PrintSongDialog({ song, open, onCloseDialog }) {
	const [lyricsAndChordsClicked, setLyricsAndChordsClicked] = useState(false);
	const [lyricsClicked, setLyricsClicked] = useState(false);

	let printLyrics = null;

	if (lyricsClicked) {
		printLyrics = (
			<PDFDownloadLink document={toPdf(song, false)} fileName={`${song.name} Lyrics.pdf`}>
				{({ blob, url, loading, error }) => (
					<Button full loading={!blob}>
						Download Now
					</Button>
				)}
			</PDFDownloadLink>
		);
	} else {
		printLyrics = (
			<Button color="black" variant="open" full onClick={() => setLyricsClicked(true)}>
				Print lyrics only
			</Button>
		);
	}

	let printLyricsAndChords = null;

	if (lyricsAndChordsClicked) {
		printLyricsAndChords = (
			<PDFDownloadLink document={toPdf(song, true)} fileName={`${song.name} Lyrics and Chords.pdf`}>
				{({ blob, url, loading, error }) => (
					<Button full loading={!blob}>
						Download Now
					</Button>
				)}
			</PDFDownloadLink>
		);
	} else {
		printLyricsAndChords = (
			<Button variant="open" color="black" full onClick={() => setLyricsAndChordsClicked(true)}>
				Print lyrics and chords
			</Button>
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
			size="sm"
			title="Printing"
			fullscreen={false}
		>
			<div className="mb-2">{printLyrics}</div>
			<div className="mb-4">{printLyricsAndChords}</div>

			<div className="flex justify-end">
				<Button variant="open" color="blue" onClick={handleCloseDialog}>
					Cancel
				</Button>
			</div>
		</StyledDialog>
	);
}
