import { useDispatch, useSelector } from "react-redux";
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
import { selectSongsCache } from "../store/cacheSlice";
import { setSongsCache } from "../store/cacheSlice";
import { useState } from "react";

export default function SongOptionsPopover({ onPrintClick }) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const router = useHistory();
	const id = parseInt(useParams().id);
	const currentMember = useSelector(selectCurrentMember);
	const songsCache = useSelector(selectSongsCache);
	const dispatch = useDispatch();

	let button = (
		<Button size="xs" variant="open" color="gray">
			<DotsVerticalIcon className="w-5 h-5" />
		</Button>
	);

	const handleDelete = async () => {
		try {
			await SongApi.deleteOneById(id);

			if (songsCache?.expires > new Date().getTime()) {
				let updatedSongs = songsCache.songs?.filter((song) => song.id !== id);
				dispatch(setSongsCache({ ...songsCache, songs: updatedSongs }));
			}

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
							className="flex items-center border-t dark:border-dark-gray-400 rounded-b-md"
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
