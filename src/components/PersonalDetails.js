import { useSelector, useDispatch } from "react-redux";
import OutlinedInput from "./inputs/OutlinedInput";
import { selectCurrentUser, setCurrentUser } from "../store/authSlice";
import { useEffect, useState } from "react";
import UserApi from "../api/UserApi";
import ProfilePictureDetail from "./ProfilePictureDetail";
import Button from "./Button";

export default function PersonalDetails() {
	const currentUser = useSelector(selectCurrentUser);
	const [updates, setUpdates] = useState({});
	const [changesMade, setChangesMade] = useState(false);
	const [savingChanges, setSavingChanges] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		if (currentUser) {
			let firstNamesDifferent =
				updates.firstName !== currentUser.first_name && updates.firstName !== undefined;
			let lastNamesDifferent =
				updates.lastName !== currentUser.last_name && updates.lastName !== undefined;

			setChangesMade(firstNamesDifferent || lastNamesDifferent);
		}
	}, [currentUser, updates]);

	const handleUpdate = (field, value) => {
		let updatesCopy;
		if (value) {
			updatesCopy = { ...updates, [field]: value };
		} else {
			updatesCopy = { ...updates, [field]: "" };
		}

		setUpdates(updatesCopy);
	};

	const handleSaveUpdates = async () => {
		setSavingChanges(true);
		try {
			let { data } = await UserApi.updateCurrentUser(updates);
			dispatch(setCurrentUser(data));
			setUpdates({});
		} catch (error) {
			console.log(error);
		} finally {
			setSavingChanges(false);
		}
	};

	const handleProfilePictureChange = () => {};

	if (currentUser) {
		return (
			<div className="max-w-4xl mx-auto">
				<div className="mb-4">
					<ProfilePictureDetail url={currentUser.image_url} />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
					<div>
						<OutlinedInput
							label="First name"
							placeholder="Enter your first name"
							value={updates.firstName !== undefined ? updates.firstName : currentUser.first_name}
							onChange={(newFirstName) => handleUpdate("firstName", newFirstName)}
						/>
					</div>
					<div>
						<OutlinedInput
							label="Last name"
							placeholder="Enter your last name"
							value={updates.lastName !== undefined ? updates.lastName : currentUser.last_name}
							onChange={(newLastName) => handleUpdate("lastName", newLastName)}
						/>
					</div>
				</div>
				<Button full disabled={!changesMade} onClick={handleSaveUpdates} loading={savingChanges}>
					Save Changes
				</Button>
			</div>
		);
	} else {
		return "You probably need to login";
	}
}
