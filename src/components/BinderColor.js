import XIcon from "@heroicons/react/solid/XIcon";

export default function BinderColor({ color, onClick, block, size, editable }) {
	const handleClick = () => {
		if (onClick && editable) {
			onClick(color);
		}
	};

	return (
		<div
			onClick={handleClick}
			className={`${HEIGHT_SIZES[size]} 
				focus:outline-none outline-none flex-center translate-y-6 rounded ${COLORS[color]}
				${block ? " w-full py-3" : WIDTH_SIZES[size]} 
				${onClick ? " cursor-pointer" : " cursor-default"} 
				${color === "none" ? " border border-gray-300" : ""}
			`}
		>
			{color === "none" ? <XIcon className="w-3 h-3 text-gray-600" /> : ""}
		</div>
	);
}

BinderColor.defaultProps = {
	color: "white",
	size: "4",
	editable: true,
};

const HEIGHT_SIZES = {
	3: "h-3",
	4: "h-4",
};

const WIDTH_SIZES = {
	3: "w-3",
	4: "w-4",
};

const COLORS = {
	red: "bg-red-400",
	blue: "bg-blue-400",
	green: "bg-green-400",
	yellow: "bg-yellow-400",
	indigo: "bg-indigo-400",
	purple: "bg-purple-400",
	pink: "bg-pink-400",
	gray: "bg-gray-400",
};
