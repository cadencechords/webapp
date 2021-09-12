import { selectCurrentMember, selectCurrentTeam, setCurrentTeam } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { EDIT_TEAM } from "../utils/constants";
import FileApi from "../api/FileApi";
import MobileProfilePictureMenu from "../components/mobile menus/MobileProfilePictureMenu";
import PageTitle from "../components/PageTitle";
import ProfilePicture from "../components/ProfilePicture";

export default function TeamDetailPage() {
	const currentTeam = useSelector(selectCurrentTeam);
	useEffect(() => (document.title = currentTeam ? currentTeam.name : "Team Details"));
	const inputRef = useRef();
	const [showImageDialog, setShowImageDialog] = useState(false);
	const dispatch = useDispatch();
	const currentMember = useSelector(selectCurrentMember);

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

	const handleTeamImageClick = () => {
		if (currentMember.can(EDIT_TEAM)) {
			setShowImageDialog(true);
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
				<ProfilePicture url={currentTeam.image_url} size="lg" onClick={handleTeamImageClick} />
				<PageTitle title={currentTeam.name} align="center" />
				{currentMember.can(EDIT_TEAM) && (
					<>
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
					</>
				)}
			</div>
		);
	} else {
		return "Loading...";
	}
}
