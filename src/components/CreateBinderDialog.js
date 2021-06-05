import { useState } from "react";
import ColorsList from "./ColorsList";
import OutlinedInput from "./inputs/OutlinedInput";
import StyledDialog from "./StyledDialog";
import Button from "./Button";
import BinderApi from "../api/BinderApi";

export default function CreateBinderDialog({ open, onCloseDialog, onCreated }) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [color, setColor] = useState("none");
	const [loading, setLoading] = useState(false);

	const handleCloseDialog = () => {
		setName("");
		setDescription("");
		setColor("none");
		setLoading(false);
		onCloseDialog();
	};

	const handleCreate = async () => {
		setLoading(true);
		try {
			let result = await BinderApi.createOne({ name, description, color });
			onCreated(result.data);
			handleCloseDialog();
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<StyledDialog title="Create a new binder" open={open} onCloseDialog={handleCloseDialog}>
			<div className="mb-4 pt-2">
				<div className="mb-2">Name</div>
				<OutlinedInput placeholder="ex: Hymns" onChange={setName} />
			</div>

			<div className="mb-4">
				<div className="mb-2">Description</div>
				<OutlinedInput
					placeholder="ex: Common English hymns that Ukrainians like"
					onChange={setDescription}
				/>
			</div>

			<div className="mb-6">
				<div className="mb-2">Color</div>
				<ColorsList onChange={setColor} color={color} />
			</div>

			<Button full loading={loading} onClick={handleCreate}>
				Create
			</Button>
		</StyledDialog>
	);
}
