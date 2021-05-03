import OpenButton from "./buttons/OpenButton";
import StyledDialog from "./StyledDialog";

export default function PrintSongDialog({ open, onCloseDialog }) {
	return (
		<StyledDialog
			open={open}
			onCloseDialog={onCloseDialog}
			size="xs"
			title="Printing"
			overlayOpacity={30}
		>
			<OpenButton full>Print lyrics only</OpenButton>
			<OpenButton full>Print lyrics and chords</OpenButton>
			<div className="flex justify-end">
				<OpenButton bold color="blue" onClick={onCloseDialog}>
					Cancel
				</OpenButton>
			</div>
		</StyledDialog>
	);
}
