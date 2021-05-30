import UserCircleIcon from "@heroicons/react/outline/UserCircleIcon";
import { useDispatch } from "react-redux";
import OpenButton from "./buttons/OpenButton";
import StyledPopover from "./StyledPopover";
import { logOut } from "../store/authSlice";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

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
						<OpenButton full bold>
							<div className="h-8 flex items-center justify-center">Settings</div>
						</OpenButton>
					</Link>
					<hr />
					<OpenButton full bold color="red" onClick={handleLogOut}>
						<div className="h-8 flex items-center justify-center">Log out</div>
					</OpenButton>
				</div>
			</StyledPopover>
		</div>
	);
}
