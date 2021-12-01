import { useEffect, useRef, useState } from "react";

import BinderApi from "../api/BinderApi";
import Button from "./Button";
import ColorsList from "./ColorsList";
import OutlinedInput from "./inputs/OutlinedInput";
import StyledDialog from "./StyledDialog";
import { reportError } from "../utils/error";
import { useHistory } from "react-router";

export default function CreateBinderDialog({ open, onCloseDialog, onCreated }) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [color, setColor] = useState("none");
	const [loading, setLoading] = useState(false);
	const router = useHistory();
	const inputRef = useRef();

	useEffect(() => {
		setTimeout(() => {
			if (open) {
				inputRef.current?.focus();
			}
		}, 100);
	}, [open]);

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
			reportError(error);
			if (error?.response?.status === 401) {
				router.push("/login");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<StyledDialog title="Create a new binder" open={open} onCloseDialog={handleCloseDialog}>
			<div className="mb-4 pt-2">
				<div className="mb-2">Name</div>
				<OutlinedInput placeholder="ex: Hymns" onChange={setName} ref={inputRef} />
			</div>

			<div className="mb-4">
				<div className="mb-2">Description</div>
				<OutlinedInput placeholder="ex: Common hymns" onChange={setDescription} />
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
