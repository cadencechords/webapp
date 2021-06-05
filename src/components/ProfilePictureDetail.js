import Label from "./Label";
import ProfilePicture from "./ProfilePicture";
import OpenButton from "./buttons/OpenButton";
import { useRef, useState } from "react";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import MobileProfilePictureMenu from "./mobile menus/MobileProfilePictureMenu";
import Button from "./Button";

export default function ProfilePictureDetail({ url }) {
	const [showMobileActionsDialog, setShowMobileActionsDialog] = useState(false);
	const inputRef = useRef();

	const handleOpenFileDialog = () => {
		inputRef.current.click();
	};

	const handleImageSelected = (files) => {
		console.log(files[0]);
	};

	return (
		<>
			<Label>Photo</Label>
			<div className="w-20 m-auto mb-4 relative">
				<ProfilePicture url={url} />
				<button
					onClick={() => setShowMobileActionsDialog(true)}
					className="focus:outline-none outline-none absolute bottom-0 left-1/2 ml-3 mb-1 border border-white bg-blue-700 p-1.5 rounded-full md:hidden"
				>
					<PencilIcon className="h-4 text-white" />
				</button>
			</div>

			<input
				type="file"
				className="hidden"
				ref={inputRef}
				accept="image/*"
				onChange={(e) => handleImageSelected(e.target.files)}
			/>
			<div className="md:flex md:justify-end hidden">
				<span className="md:mr-2 md:w-20">
					<Button color="black" variant="outlined" full onClick={handleOpenFileDialog}>
						Change
					</Button>
				</span>
				<OpenButton bold full className="md:w-20">
					Remove
				</OpenButton>
			</div>
			<MobileProfilePictureMenu
				open={showMobileActionsDialog}
				onCloseDialog={() => setShowMobileActionsDialog(false)}
				onOpenFileDialog={handleOpenFileDialog}
			/>
		</>
	);
}
