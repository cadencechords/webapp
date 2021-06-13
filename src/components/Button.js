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
	let defaultClasses = ` outline-none focus:outline-none transition-colors text-sm ${className} `;
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
			colorClasses += ` text-white bg-${color}-600 hover:bg-${color}-800 focus:bg-${color}-800 shadow-sm `;
		}
		loadingColor = "white";
		disabledClasses += ` bg-gray-100 text-gray-600 `;
		roundedClasses += " rounded-md ";
	} else if (variant === "open") {
		colorClasses += ` text-${color}-600 hover:bg-gray-100 focus:bg-gray-100 `;
		disabledClasses += ` text-gray-500 `;
		roundedClasses += " rounded-md ";
	} else if (variant === "outlined") {
		colorClasses += ` border border-gray-300 text-${color}-600 hover:bg-gray-100 focus:bg-gray-100 `;
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
