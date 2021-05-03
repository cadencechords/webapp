import OutlinedInput from "./inputs/OutlinedInput";
import StyledDialog from "./StyledDialog";
import PillButton from "./buttons/PillButton";

export default function CreateSongDialog({ open, onCloseDialog }) {
	return (
		<StyledDialog
			title="Create a new song"
			open={open}
			onCloseDialog={onCloseDialog}
			size="lg"
		>
			<div className="mb-2">Title</div>
			<OutlinedInput placeholder="ex: Amazing Grace" />
			<button
				style={{ background: "#2266f7" }}
				className="rounded-md shadow-md flex items-center justify-center py-3 focus:outline-none my-2"
			>
				<img
					src="http://localhost:3000/planning-center-white.svg"
					width="40%"
					alt="Planning Center logo"
				/>
			</button>
			<div className="mt-4 flex justify-end">
				<PillButton color="purple">Create</PillButton>
			</div>
		</StyledDialog>
	);
}
