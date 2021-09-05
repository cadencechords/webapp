import Button from "../components/Button";
import StyledDialog from "../components/StyledDialog";
import { useState } from "react";

export default function ConfirmDeleteDialog({ onConfirm, onCancel, show, onCloseDialog, text }) {
	const [loading, setLoading] = useState(false);

	const handleConfirm = () => {
		setLoading(true);
		onConfirm?.();
	};

	return (
		<StyledDialog
			title="Are you sure?"
			open={show}
			onCloseDialog={onCloseDialog}
			fullscreen={false}
			borderedTop={false}
		>
			<div className="mb-6">{text ? text : "Deleting this item is irreversible."}</div>
			<div className="flex gap-2">
				<Button full color="red" onClick={onCancel}>
					Cancel
				</Button>
				<Button full variant="open" color="gray" onClick={handleConfirm} loading={loading}>
					Yes, delete
				</Button>
			</div>
		</StyledDialog>
	);
}
