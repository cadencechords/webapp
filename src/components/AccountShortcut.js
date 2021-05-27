import UserCircleIcon from "@heroicons/react/outline/UserCircleIcon";
import { Link } from "react-router-dom";

export default function AccountShortcut() {
	return (
		<div className="mr-5">
			<Link to="/app/account">
				<UserCircleIcon className="h-6 w-6 text-gray-400 hover:text-gray-500 transition-all cursor-pointer" />
			</Link>
		</div>
	);
}
