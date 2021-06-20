import PulseLoader from "react-spinners/PulseLoader";

export default function Button({
	children,
	variant,
	color,
	size,
	full,
	bold,
	onClick,
	loading,
	disabled,
	className,
	onKeyUp,
}) {
	let defaultClasses = ` outline-none focus:outline-none transition-colors text-sm ${
		className ? className : ""
	} `;
	let colorClasses = "";
	let disabledClasses = " cursor-default ";
	let roundedClasses = "";
	let sizeClasses = ` ${sizePaddings[size]} ${full ? " w-full " : ""}`;
	let fontClasses = ` ${bold ? " font-semibold " : ""} `;
	let loadingColor = color;

	if (variant === "filled") {
		if (color === "black") {
			colorClasses += ` text-white bg-black `;
		} else {
			colorClasses += ` text-white ${BACKGROUND_COLORS[color]} shadow-sm `;
		}
		loadingColor = "white";
		disabledClasses += ` bg-gray-100 text-gray-600 `;
		roundedClasses += " rounded-md ";
	} else if (variant === "open") {
		colorClasses += ` ${TEXT_COLORS[color]} hover:bg-gray-100 focus:bg-gray-100 `;
		disabledClasses += ` text-gray-500 `;
		roundedClasses += " rounded-md ";
	} else if (variant === "outlined") {
		colorClasses += ` border border-gray-300 ${TEXT_COLORS[color]} hover:bg-gray-100 focus:bg-gray-100 `;
		disabledClasses += ` border border-gray-300 text-gray-500 `;
		roundedClasses += " rounded-md ";
	}

	return (
		<button
			className={`${defaultClasses}
            ${disabled ? disabledClasses : colorClasses} 
            ${sizeClasses} ${fontClasses} ${roundedClasses} h`}
			onClick={onClick}
			disabled={disabled}
			onKeyUp={onKeyUp}
		>
			{loading ? <PulseLoader color={loadingColor} size={8} /> : children}
		</button>
	);
}

Button.defaultProps = {
	bold: true,
	full: false,
	color: "blue",
	variant: "filled",
	loading: false,
	disabled: false,
	size: "sm",
};

const sizePaddings = {
	xs: " px-2 h-7",
	sm: " px-3 h-9 ",
	small: " px-3 h-9 ",
};

export const TEXT_COLORS = {
	red: "text-red-600",
	blue: "text-blue-600",
	green: "text-green-600",
	yellow: "text-yellow-600",
	indigo: "text-indigo-600",
	purple: "text-purple-600",
	pink: "text-pink-600",
	gray: "text-gray-600",
	black: "text-black",
	white: "text-white",
};

export const BACKGROUND_COLORS = {
	red: "bg-red-600 hover:bg-red-800 focus:bg-red-800",
	blue: "bg-blue-600 hover:bg-blue-800 focus:bg-blue-800",
	green: "bg-green-600 hover:bg-green-800 focus:bg-green-800",
	yellow: "bg-yellow-600 hover:bg-yellow-800 focus:bg-yellow-800",
	indigo: "bg-indigo-600 hover:bg-indigo-800 focus:bg-indigo-800",
	purple: "bg-purple-600 hover:bg-purple-800 focus:bg-purple-800",
	pink: "bg-pink-600 hover:bg-pink-800 focus:bg-pink-800",
	gray: "bg-gray-600 hover:bg-gray-800 focus:bg-gray-800",
	black: "bg-black",
	white: "bg-white",
};
