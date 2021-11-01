import { DELETE_FILES, EDIT_FILES } from "../utils/constants";

import Button from "./Button";
import DotsVerticalIcon from "@heroicons/react/outline/DotsVerticalIcon";
import DownloadIcon from "@heroicons/react/outline/DownloadIcon";
import MobileMenuButton from "./buttons/MobileMenuButton";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import StyledPopover from "./StyledPopover";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";

export default function SongFileOptionsPopover({ onDelete, onEdit, file }) {
	const currentMember = useSelector(selectCurrentMember);

	const button = (
		<Button variant="open" color="gray">
			<DotsVerticalIcon className="w-4 h-4" />
		</Button>
	);
	return (
		<StyledPopover button={button}>
			<div className="rounded-lg shadow-xl bg-white w-48">
				<a
					href={file.url}
					target="_blank"
					rel="noreferrer"
					className="border-gray-300 border-b first:rounded-t-lg last:rounded-b-lg block"
				>
					<MobileMenuButton full className="text-left " color="black">
						<div className="flex items-center">
							<DownloadIcon className="w-4 h-4 mr-4" /> Download
						</div>
					</MobileMenuButton>
				</a>
				{currentMember.can(EDIT_FILES) && (
					<MobileMenuButton
						full
						className="text-left border-gray-300 border-b last:border-0 first:rounded-t-lg last:rounded-b-lg"
						color="black"
						onClick={onEdit}
					>
						<div className="flex items-center">
							<PencilIcon className="w-4 h-4 mr-4" /> Edit
						</div>
					</MobileMenuButton>
				)}
				{currentMember.can(DELETE_FILES) && (
					<MobileMenuButton
						full
						className="text-left first:rounded-t-lg last:rounded-b-lg"
						color="red"
						onClick={onDelete}
					>
						<div className="flex items-center">
							<TrashIcon className="w-4 h-4 mr-4" /> Delete
						</div>
					</MobileMenuButton>
				)}
			</div>
		</StyledPopover>
	);
}
