import { useHistory, useParams } from "react-router-dom";

import BinderApi from "../api/BinderApi";
import Button from "./Button";
import ConfirmDeleteDialog from "../dialogs/ConfirmDeleteDialog";
import DotsVerticalIcon from "@heroicons/react/outline/DotsVerticalIcon";
import MobileMenuButton from "./buttons/MobileMenuButton";
import StyledPopover from "./StyledPopover";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import { reportError } from "../utils/error";
import { useState } from "react";

export default function BinderOptionsPopover({ onDeleteClick, onChangeColorClick }) {
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
			await BinderApi.deleteOneById(id);
			router.push("/binders");
		} catch (error) {
			reportError(error);
		}
	};

	return (
		<>
			<ConfirmDeleteDialog
				show={showDeleteDialog}
				onCloseDialog={() => setShowDeleteDialog(false)}
				onCancel={() => setShowDeleteDialog(false)}
				onConfirm={handleDelete}
			>
				Deleting this binder will NOT delete any songs in the binder. Deleting is irreversible.
			</ConfirmDeleteDialog>
			<StyledPopover button={button} position="bottom-start">
				<div className="w-60">
					<MobileMenuButton
						full
						color="black"
						className="flex items-center rounded-t-md"
						onClick={onChangeColorClick}
					>
						Change color
					</MobileMenuButton>
					<MobileMenuButton
						full
						color="red"
						className="flex items-center border-t"
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
