import Button from "./Button";
import MetronomeIcon from "../icons/MetronomeIcon";
import StyledDialog from "./StyledDialog";
import { useState } from "react";

export default function MetronomeDialog({ children }) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button
				variant="open"
				color="gray"
				className="fixed bottom-6 right-6"
				onClick={() => setOpen(true)}
			>
				<MetronomeIcon className="w-5 h-5" />
			</Button>
			<StyledDialog
				open={open}
				onCloseDialog={() => setOpen(false)}
				borderedTop={false}
				fullscreen={false}
				title="Metronome"
			>
				{children}
			</StyledDialog>
		</>
	);
}
