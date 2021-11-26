import { logOut, selectCurrentUser } from "../store/authSlice";

import { Link } from "react-router-dom";
import MobileMenuButton from "./buttons/MobileMenuButton";
import ProfilePicture from "./ProfilePicture";
import StyledPopover from "./StyledPopover";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

export default function AccountOptionsPopover() {
	const dispatch = useDispatch();
	const router = useHistory();
	const currentUser = useSelector(selectCurrentUser);

	let button = <ProfilePicture url={currentUser?.image_url} size="xs" />;

	const handleLogOut = () => {
		dispatch(logOut());
		router.push("/login");
	};

	return (
		<div className="mr-5">
			<StyledPopover button={button} position="bottom-start">
				<div className="w-60">
					<Link to="/account">
						<MobileMenuButton color="black" full size="sm" className="rounded-t-md">
							Account
						</MobileMenuButton>
					</Link>
					<hr className="dark:border-dark-gray-400" />
					<MobileMenuButton
						full
						color="red"
						onClick={handleLogOut}
						className="rounded-b-md"
						size="sm"
					>
						Log out
					</MobileMenuButton>
				</div>
			</StyledPopover>
		</div>
	);
}
