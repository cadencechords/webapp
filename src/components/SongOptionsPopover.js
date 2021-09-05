import { useHistory, useParams } from "react-router-dom";

import Button from "./Button";
import ConfirmDeleteDialog from "../dialogs/ConfirmDeleteDialog";
import DotsVerticalIcon from "@heroicons/react/outline/DotsVerticalIcon";
import MobileMenuButton from "./buttons/MobileMenuButton";
import SongApi from "../api/SongApi";
import StyledPopover from "./StyledPopover";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import { useState } from "react";

export default function SongOptionsPopover({ onDeleteClick }) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const router = useHistory();
	const id = useParams().id;

	let button = (
		<Button size="xs" variant="open">
			<DotsVerticalIcon className="w-5 h-5 text-gray-500" />
		</Button>
	);

	const handleDelete = async () => {
		try {
			await SongApi.deleteOneById(id);
			router.push("/songs");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<ConfirmDeleteDialog
				show={showDeleteDialog}
				onCloseDialog={() => setShowDeleteDialog(false)}
				onCancel={() => setShowDeleteDialog(false)}
				onConfirm={handleDelete}
			/>
			<StyledPopover button={button} position="bottom-start">
				<div className="w-60">
					<MobileMenuButton
						full
						color="red"
						className="flex items-center"
						onClick={() => setShowDeleteDialog(true)}
					>
						<TrashIcon className="w-5 h-5 mr-3" />
						Delete
					</MobileMenuButton>
				</div>
			</StyledPopover>
		</>
	);
}
