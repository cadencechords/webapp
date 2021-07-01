import Label from "./Label";
import ProfilePicture from "./ProfilePicture";
import { useRef, useState } from "react";
import PencilIcon from "@heroicons/react/outline/PencilIcon";
import MobileProfilePictureMenu from "./mobile menus/MobileProfilePictureMenu";
import Button from "./Button";
import FileApi from "../api/FileApi";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, setCurrentUser } from "../store/authSlice";

export default function ProfilePictureDetail({ url }) {
	const [showMobileActionsDialog, setShowMobileActionsDialog] = useState(false);
	const dispatch = useDispatch();
	const currentUser = useSelector(selectCurrentUser);
	const inputRef = useRef();
	const [uploading, setUploading] = useState(false);
	const [removing, setRemoving] = useState(false);

	const handleOpenFileDialog = () => {
		inputRef.current.click();
	};

	const handleImageSelected = async (files) => {
		let tempImageUrl = URL.createObjectURL(files[0]);
		dispatch(setCurrentUser({ ...currentUser, image_url: tempImageUrl }));

		try {
			setShowMobileActionsDialog(false);
			setUploading(true);
			await FileApi.addImageToUser(files[0]);
		} catch (error) {
			console.log(error);
			dispatch(setCurrentUser({ ...currentUser, image_url: null }));
		} finally {
			setUploading(false);
			URL.revokeObjectURL(tempImageUrl);
		}
	};

	const handleDeleteImage = async () => {
		try {
			setRemoving(true);
			await FileApi.deleteUserImage();
			dispatch(setCurrentUser({ ...currentUser, image_url: null }));
		} catch (error) {
			console.log(error);
		} finally {
			setRemoving(false);
		}
	};

	return (
		<>
			<Label>Photo</Label>
			<div className="m-auto mb-4 relative">
				<div className="flex-center">
					<ProfilePicture url={url} size="xl2" />
				</div>
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
					<Button
						color="black"
						variant="outlined"
						full
						onClick={handleOpenFileDialog}
						loading={uploading}
					>
						Change
					</Button>
				</span>
				<Button
					variant="open"
					color="black"
					className="md:w-20"
					onClick={handleDeleteImage}
					loading={removing}
				>
					Remove
				</Button>
			</div>
			<MobileProfilePictureMenu
				open={showMobileActionsDialog}
				onCloseDialog={() => setShowMobileActionsDialog(false)}
				onOpenFileDialog={handleOpenFileDialog}
				onDeleteImage={handleDeleteImage}
			/>
		</>
	);
}
