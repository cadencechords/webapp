import { useEffect, useState } from "react";
import { useParams } from "react-router";
import BinderColor from "./BinderColor";
import BinderSongsList from "./BinderSongsList";
import ColorDialog from "./ColorDialog";
import PageTitle from "./PageTitle";
import PulseLoader from "react-spinners/PulseLoader";
import BinderApi from "../api/BinderApi";
import { isEmpty } from "../utils/ObjectUtils";
import FilledButton from "./buttons/FilledButton";
import EditableData from "./inputs/EditableData";

export default function BinderDetail() {
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [binder, setBinder] = useState();
	const [pendingUpdates, setPendingUpdates] = useState({});
	const [saving, setSaving] = useState(false);
	const { id } = useParams();

	useEffect(() => {
		async function fetchBinder() {
			try {
				let { data } = await BinderApi.getOneById(id);
				setBinder(data);
			} catch (error) {
				console.log(error);
			}
		}

		fetchBinder();
	}, [id]);

	const handleUpdate = (field, value) => {
		let updates = { ...pendingUpdates };
		updates[field] = value;
		setPendingUpdates(updates);

		let updatedBinder = { ...binder };
		updatedBinder[field] = value;
		setBinder(updatedBinder);
	};

	const handleSaveChanges = async () => {
		setSaving(true);
		try {
			let { data } = await BinderApi.updateOneById(id, pendingUpdates);
			setBinder(data);
			setPendingUpdates({});
		} catch (error) {
			console.log(error);
		} finally {
			setSaving(false);
		}
	};

	if (!binder) {
		return (
			<div className="text-center py-4">
				<PulseLoader color="blue" />
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center">
				<span className="mr-2 cursor-pointer">
					<BinderColor color={binder.color} onClick={() => setShowColorPicker(true)} />
					<ColorDialog
						open={showColorPicker}
						onCloseDialog={() => setShowColorPicker(false)}
						binderColor={binder.color}
						onChange={(editedColor) => handleUpdate("color", editedColor)}
					/>
				</span>
				<PageTitle
					title={binder.name}
					editable
					onChange={(editedName) => handleUpdate("name", editedName)}
				/>
			</div>
			<div>
				<EditableData
					placeholder="Add a description for this binder"
					value={binder.description}
					onChange={(editedDescription) => handleUpdate("description", editedDescription)}
				/>
			</div>
			<BinderSongsList
				boundSongs={binder.songs}
				onChange={(editedSongsList) => handleUpdate("songs", editedSongsList)}
			/>

			{!isEmpty(pendingUpdates) && (
				<div className="fixed bottom-8 right-8 shadow-md">
					<FilledButton bold onClick={handleSaveChanges} loading={saving}>
						Save Changes
					</FilledButton>
				</div>
			)}
		</div>
	);
}
