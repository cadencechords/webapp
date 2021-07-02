import { useEffect } from "react";
import NoDataMessage from "../components/NoDataMessage";
import CenteredPage from "../components/CenteredPage";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser } from "../store/authSlice";
import ProfilePicture from "../components/ProfilePicture";
import { Link, useHistory } from "react-router-dom";
import Button from "../components/Button";
import SectionTitle from "../components/SectionTitle";

export default function AccountDetailPage() {
	const currentUser = useSelector(selectCurrentUser);
	const dispatch = useDispatch();
	const router = useHistory();

	useEffect(() => {
		document.title = "Account Details";
	}, []);

	const handleLogout = () => {
		dispatch(logOut());
		router.push("/login");
	};

	if (currentUser) {
		return (
			<>
				<div className="text-gray-500">
					<div className="w-24 m-auto flex-center my-2">
						<ProfilePicture url={currentUser.image_url} />
					</div>
					<div className="font-semibold text-sm text-center mb-1">{currentUser.email}</div>
					{currentUser.first_name ? (
						<div className="font-semibold text-black text-center text-xl">
							{currentUser.first_name} {currentUser.last_name}
						</div>
					) : (
						<div className="text-center">
							You haven't provided your name yet. You can do that
							<Link to="/app/account/personal">here</Link>
						</div>
					)}
				</div>
				<SectionTitle title="Log Out" underline />
				<div className="mb-1">Switch to or create another team</div>
				<Link to="/login/teams">
					<Button variant="outlined" color="black" className="w-full sm:w-auto">
						Switch teams
					</Button>
				</Link>
				<div className="mt-4 mb-1">Log out of your account completely</div>
				<span>
					<Button onClick={handleLogout} color="red" className="w-full sm:w-auto">
						Log out
					</Button>
				</span>
			</>
		);
	} else {
		return (
			<CenteredPage>
				<NoDataMessage>You'll need to sign in first</NoDataMessage>;
			</CenteredPage>
		);
	}
}
