import OutlinedInput from "./inputs/OutlinedInput";
import StyledDialog from "./StyledDialog";

export default function CreateBinderDialog({ open, onCloseDialog }) {
	return (
		<StyledDialog
			title="Create a new binder"
			open={open}
			onCloseDialog={onCloseDialog}
		>
			<div className="mb-2">Name</div>
			<OutlinedInput placeholder="ex: Hymns" />
		</StyledDialog>
	);
}
