import StyledDialog from "./StyledDialog";
import Button from "./Button";
import { useState } from "react";

export default function MetronomeDialog({ children }) {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button variant="open" className="fixed bottom-6 right-6" onClick={() => setOpen(true)}>
				Metronome
			</Button>
			<StyledDialog
				open={open}
				onCloseDialog={() => setOpen(false)}
				borderedTop={false}
				fullscreen={false}
			>
				{children}
			</StyledDialog>
		</>
	);
}
