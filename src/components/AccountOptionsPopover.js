import UserCircleIcon from "@heroicons/react/outline/UserCircleIcon";
import { useDispatch } from "react-redux";
import StyledPopover from "./StyledPopover";
import { logOut } from "../store/authSlice";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import Button from "./Button";

export default function AccountOptionsPopover() {
	const dispatch = useDispatch();
	const router = useHistory();

	let button = (
		<UserCircleIcon className="h-6 w-6 text-gray-400 hover:text-gray-500 transition-all cursor-pointer" />
	);

	const handleLogOut = () => {
		dispatch(logOut());
		router.push("/login");
	};

	return (
		<div className="mr-5">
			<StyledPopover button={button} position="bottom-start">
				<div className="w-60">
					<Link to="/app/account">
						<Button variant="open" color="black" full>
							<div className="h-8 flex items-center justify-center">Settings</div>
						</Button>
					</Link>
					<hr />
					<Button variant="open" full color="red" onClick={handleLogOut}>
						<div className="h-8 flex items-center justify-center">Log out</div>
					</Button>
				</div>
			</StyledPopover>
		</div>
	);
}
