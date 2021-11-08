import { useHistory, useParams } from "react-router-dom";

import Button from "./Button";
import ConfirmDeleteDialog from "../dialogs/ConfirmDeleteDialog";
import { DELETE_SONGS } from "../utils/constants";
import DotsVerticalIcon from "@heroicons/react/outline/DotsVerticalIcon";
import MobileMenuButton from "./buttons/MobileMenuButton";
import PrinterIcon from "@heroicons/react/outline/PrinterIcon";
import SongApi from "../api/SongApi";
import StyledPopover from "./StyledPopover";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import { reportError } from "../utils/error";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function SongOptionsPopover({ onDeleteClick, onPrintClick }) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const router = useHistory();
	const id = useParams().id;
	const currentMember = useSelector(selectCurrentMember);

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
			/>
			<StyledPopover button={button} position="bottom-start">
				<div className="w-60">
					<MobileMenuButton
						onClick={onPrintClick}
						full
						color="black"
						className="flex items-center rounded-t-md"
					>
						<PrinterIcon className="w-5 h-5 mr-3" />
						Print
					</MobileMenuButton>
					{currentMember.can(DELETE_SONGS) && (
						<MobileMenuButton
							full
							color="red"
							className="flex items-center border-t rounded-b-md"
							onClick={() => setShowDeleteDialog(true)}
						>
							<TrashIcon className="w-5 h-5 mr-3" />
							Delete
						</MobileMenuButton>
					)}
				</div>
			</StyledPopover>
		</>
	);
}
