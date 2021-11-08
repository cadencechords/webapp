import AddCancelActions from "./buttons/AddCancelActions";
import OutlinedInput from "./inputs/OutlinedInput";
import PropTypes from "prop-types";
import SetlistApi from "../api/SetlistApi";
import StyledDialog from "./StyledDialog";
import { reportError } from "../utils/error";
import { useState } from "react";

export default function CreateSetlistDialog({ open, onCloseDialog, onCreated }) {
	const [name, setName] = useState("");
	const [scheduledDate, setScheduledDate] = useState("");
	const [dateValid, setDateValid] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleValidateDate = () => {
		let dateToValidate = new Date(scheduledDate);
		setDateValid(!isNaN(dateToValidate));
	};

	const canCreate = name && dateValid;

	const handleCreateSetlist = async () => {
		setLoading(true);
		try {
			let isoScheduledDate = new Date(scheduledDate).toISOString();
			let { data } = await SetlistApi.createOne({ name, scheduledDate: isoScheduledDate });
			onCreated(data);
			handleCloseDialog();
		} catch (error) {
			reportError(error);
			setLoading(false);
		}
	};

	const clearFields = () => {
		setLoading(false);
		setDateValid(false);
		setName("");
		setScheduledDate("");
	};

	const handleCloseDialog = () => {
		clearFields();
		onCloseDialog();
	};

	return (
		<StyledDialog title="Create a set" open={open} onCloseDialog={handleCloseDialog}>
			<div className="mb-4">
				<OutlinedInput
					label="Name"
					placeholder="Give your set a name"
					value={name}
					onChange={setName}
				/>
			</div>

			<div className="mb-4">
				<OutlinedInput
					type="date"
					onChange={setScheduledDate}
					value={scheduledDate}
					label="Scheduled date"
					onBlur={handleValidateDate}
					className="h-10"
				/>
			</div>
			<AddCancelActions
				onCancel={handleCloseDialog}
				addText="Create"
				addDisabled={!canCreate}
				onAdd={handleCreateSetlist}
				loadingAdd={loading}
			/>
		</StyledDialog>
	);
}

CreateSetlistDialog.propTypes = {
	onCreated: PropTypes.func.isRequired,
};
