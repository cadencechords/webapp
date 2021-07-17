import StyledDialog from "./StyledDialog";
import SongKeyButton from "./buttons/SongKeyButton";
import { useEffect, useState } from "react";
import ButtonSwitch from "./buttons/ButtonSwitch";
import Button from "./Button";

export default function KeyChooserDialog({ open, onCloseDialog, currentSongKey, onChange }) {
	const [keyNote, setKeyNote] = useState(() => {
		if (currentSongKey) {
			return currentSongKey.charAt?.(0);
		} else {
			return "G";
		}
	});

	const [keyQuality, setKeyQuality] = useState(() => {
		return currentSongKey?.length > 1 ? "m" : "";
	});

	useEffect(() => {
		if (currentSongKey?.charAt?.(0)) {
			setKeyNote(currentSongKey.charAt(0));
		} else {
			setKeyNote("G");
		}

		setKeyQuality(currentSongKey?.length > 1 ? "m" : "");
	}, [currentSongKey, open]);

	const handleKeyChange = (newKey) => {
		setKeyNote(newKey);
	};

	const handleQualityChange = (newQuality) => {
		let shortQuality = newQuality === "Major" ? "" : "m";
		setKeyQuality(shortQuality);
	};

	const isMajor = () => {
		return keyQuality === "";
	};

	return (
		<StyledDialog
			borderedTop={false}
			open={open}
			onCloseDialog={onCloseDialog}
			title={currentSongKey ? "Original key:  " + currentSongKey : "Original key: none"}
			fullscreen={false}
		>
			<h1 className="text-center text-3xl font-bold mb-4">{keyNote + keyQuality}</h1>
			<h4>Choose a new key</h4>
			<div className="grid grid-cols-3 gap-2 my-4">
				{NOTE_NAMES.map((noteName) => (
					<SongKeyButton
						key={noteName}
						songKey={noteName}
						selected={keyNote === noteName}
						onClick={() => handleKeyChange(noteName)}
					/>
				))}
				<div></div>
				<SongKeyButton
					songKey="G"
					selected={keyNote === "G"}
					onClick={() => handleKeyChange("G")}
				/>
				<div></div>
			</div>
			<div className="mb-10">
				<h4 className="mb-3">Choose major or minor</h4>
				<ButtonSwitch
					buttonLabels={["Major", "Minor"]}
					activeButtonLabel={isMajor() ? "Major" : "Minor"}
					onClick={handleQualityChange}
				/>
			</div>
			<div className="flex gap-2">
				<Button full variant="open" onClick={onCloseDialog}>
					Cancel
				</Button>
				<Button full onClick={() => onChange(keyNote + keyQuality)}>
					Confirm
				</Button>
			</div>
		</StyledDialog>
	);
}

const NOTE_NAMES = ["A", "B", "C", "D", "E", "F"];
