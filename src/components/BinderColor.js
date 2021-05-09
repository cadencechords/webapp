import XIcon from "@heroicons/react/solid/XIcon";

export default function BinderColor({ color, onClick, block, size }) {
	const handleClick = () => {
		if (onClick) {
			onClick(color);
		}
	};

	return (
		<div
			onClick={handleClick}
			className={`h-${size} focus:outline-none outline-none flex items-center justify-center translate-y-6 rounded bg-${color}-400 ${
				block ? " w-full py-3" : "w-" + size
			} ${onClick ? " cursor-pointer" : " cursor-default"} ${
				color === "none" ? " border border-gray-300" : ""
			}`}
		>
			{color === "none" ? <XIcon className="w-3 h-3 text-gray-600" /> : ""}
		</div>
	);
}

BinderColor.defaultProps = {
	color: "white",
	size: "4",
};
