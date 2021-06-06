import XIcon from "@heroicons/react/outline/XIcon";
import Button from "./Button";

export default function Alert({ dismissable, color, onDismiss, children }) {
	return (
		<div
			className={`rounded bg-${color}-100 py-2 px-3 text-${color}-800  flex items-center justify-between`}
		>
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
