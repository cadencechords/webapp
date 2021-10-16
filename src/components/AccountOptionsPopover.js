import { logOut, selectCurrentUser } from "../store/authSlice";

import Button from "./Button";
import { Link } from "react-router-dom";
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
						<Button variant="open" color="black" full>
							<div className="h-8 flex-center">Account</div>
						</Button>
					</Link>
					<hr />
					<Button variant="open" full color="red" onClick={handleLogOut}>
						<div className="h-8 flex-center">Log out</div>
					</Button>
				</div>
			</StyledPopover>
		</div>
	);
}
