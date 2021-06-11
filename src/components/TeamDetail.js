import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileApi from "../api/FileApi";
import { selectCurrentTeam, setCurrentTeam } from "../store/authSlice";
import PageTitle from "./PageTitle";
import ProfilePicture from "./ProfilePicture";
import MobileProfilePictureMenu from "./mobile menus/MobileProfilePictureMenu";

export default function TeamDetail() {
	const currentTeam = useSelector(selectCurrentTeam);
	useEffect(() => (document.title = currentTeam ? currentTeam.name : "Team Details"));
	const inputRef = useRef();
	const [showImageDialog, setShowImageDialog] = useState(false);
	const dispatch = useDispatch();

	const handleOpenFileDialog = () => {
		inputRef.current.click();
	};

	const handleImageSelected = async (e) => {
		let tempImageUrl = URL.createObjectURL(e.target.files[0]);
		dispatch(setCurrentTeam({ ...currentTeam, image_url: tempImageUrl }));

		try {
			setShowImageDialog(false);
			console.log(e.target.files[0]);
			try {
				await FileApi.addImageToTeam(e.target.files[0]);
			} catch (error) {
				console.log(error);
				dispatch(setCurrentTeam({ ...currentTeam, image_url: null }));
			} finally {
				URL.revokeObjectURL(tempImageUrl);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeleteImage = async () => {
		try {
			dispatch(setCurrentTeam({ ...currentTeam, image_url: null }));
			await FileApi.deleteTeamImage();
		} catch (error) {
			console.log(error);
		}
	};

	if (currentTeam) {
		return (
			<div className="flex items-center flex-col pt-4">
				<ProfilePicture
					url={currentTeam.image_url}
					size="lg"
					onClick={() => setShowImageDialog(true)}
				/>
				<PageTitle title={currentTeam.name} align="center" />
				<input
					type="file"
					accept="image/*"
					onChange={handleImageSelected}
					className="hidden"
					ref={inputRef}
				/>
				<MobileProfilePictureMenu
					open={showImageDialog}
					onCloseDialog={() => setShowImageDialog(false)}
					onOpenFileDialog={handleOpenFileDialog}
					onDeleteImage={handleDeleteImage}
				/>
			</div>
		);
	} else {
		return "Loading...";
	}
}
