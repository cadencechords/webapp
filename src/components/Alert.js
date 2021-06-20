import XIcon from "@heroicons/react/outline/XIcon";
import Button from "./Button";

export default function Alert({ dismissable, color, onDismiss, children }) {
	return (
		<div className={`rounded ${COLOR_CLASSES[color]}  flex items-center justify-between`}>
			{children}
			{dismissable && (
				<Button size="xs" variant="open" color="black" onClick={onDismiss}>
					<XIcon className="w-4 h-4" />
				</Button>
			)}
		</div>
	);
}

Alert.defaultProps = {
	color: "blue",
	dismissable: false,
};

const COLOR_CLASSES = {
	red: "bg-red-100 text-red-800",
	blue: "bg-blue-100 text-blue-800",
	gray: "bg-gray-100 text-gray-800",
	yellow: "bg-yellow-100, text-gray-800",
	green: "bg-green-100 text-gray-800",
	indigo: "bg-indigo-100 text-indigo-800",
	purple: "bg-purple-100 text-purple-800",
	pink: "bg-pink-100 text-pink-800",
	black: "bg-black text-white",
	white: "bg-white text-black",
};
