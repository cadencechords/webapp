import CapoOptions from "../components/CapoOptions";
import SectionTitle from "../components/SectionTitle";
import StyledDialog from "../components/StyledDialog";
import Toggle from "../components/Toggle";
import { useState } from "react";

export default function PresenterKeyCapoDialog({ open, onCloseDialog, song, onSongChange }) {
	const [capo, setCapo] = useState("");
	return (
		<StyledDialog open={open} onCloseDialog={onCloseDialog} title="Keys" fullscreen={false}>
			<SectionTitle title="Key" />
			<Toggle
				label="Transpose"
				enabled={song.show_transposed}
				onChange={() => onSongChange("show_transposed", !song?.show_transposed)}
			/>

			<SectionTitle title="Capo" />
			<CapoOptions selectedCapo={capo} onCapoChange={setCapo} />
		</StyledDialog>
	);
}
