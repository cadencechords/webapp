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
	style,
	tabIndex,
	onFocus,
	onBlur,
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
			className={`
            ${disabled ? disabledClasses : colorClasses} 
            ${sizeClasses} ${fontClasses} ${roundedClasses} ${defaultClasses}`}
			onClick={loading ? null : onClick}
			disabled={disabled}
			onKeyUp={onKeyUp}
			style={style}
			tabIndex={tabIndex}
			onFocus={onFocus?.()}
			onBlur={onBlur?.()}
		>
			{loading ? <PulseLoader color={loadingColor} size={6} /> : children}
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
	square: "",
	xs: " px-2 min-h-7 h-7",
	sm: " px-3 h-9 ",
	small: " px-3 h-9 ",
	md: " w-20 h-14 ",
	medium: " w-20 h-14 ",
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
	red: "bg-red-500 hover:bg-red-700 focus:bg-red-700",
	blue: "bg-blue-600 hover:bg-blue-800 focus:bg-blue-800",
	green: "bg-green-500 hover:bg-green-700 focus:bg-green-700",
	yellow: "bg-yellow-400 hover:bg-yellow-600 focus:bg-yellow-600",
	indigo: "bg-indigo-600 hover:bg-indigo-800 focus:bg-indigo-800",
	purple: "bg-purple-600 hover:bg-purple-800 focus:bg-purple-800",
	pink: "bg-pink-500 hover:bg-pink-700 focus:bg-pink-700",
	gray: "bg-gray-600 hover:bg-gray-800 focus:bg-gray-800",
	black: "bg-black",
	white: "bg-white",
};
