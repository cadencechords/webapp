import Alert from "./Alert";
import CheckCircleIcon from "@heroicons/react/outline/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/outline/XCircleIcon";

export default function PasswordRequirements({ isLongEnough, isUncommon }) {
	let checkIcon = <CheckCircleIcon className="w-4 h-4 mx-3 text-green-600 dark:text-dark-green" />;
	let xIcon = <XCircleIcon className="w-4 h-4 mx-3 text-red-600 dark:text-dark-red" />;
	return (
		<div className="mb-4">
			<Alert color="gray">
				<div className="flex flex-col text-sm">
					<div className="font-semibold">Your password should:</div>
					<ul>
						<li className="flex items-center mt-1">
							{isLongEnough ? checkIcon : xIcon}
							Be at least 8 characters long
						</li>
						<li className="flex items-center mt-1">
							{isUncommon ? checkIcon : xIcon}
							Not be a common password
						</li>
					</ul>
				</div>
			</Alert>
		</div>
	);
}

PasswordRequirements.defaultProps = {
	isLongEnough: false,
	isUncommon: false,
};
