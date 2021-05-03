import XIcon from "@heroicons/react/outline/XIcon";
import OpenButton from "./buttons/OpenButton";

export default function Alert({ dismissable, color, onDismiss, children }) {
	return (
		<div
			className={`rounded bg-${color}-100 py-2 px-3 text-${color}-800  flex items-center justify-between`}
		>
			{children}
			{dismissable && (
				<OpenButton hoverWeight={0} onClick={onDismiss}>
					<XIcon className="w-4 h-4" />
				</OpenButton>
			)}
		</div>
	);
}

Alert.defaultProps = {
	color: "blue",
	dismissable: false,
};
