import PulseLoader from "react-spinners/PulseLoader";

export default function OpenButton({
	children,
	color,
	onClick,
	full,
	bold,
	hoverWeight,
	hoverColor,
	loading,
	disabled,
	className,
}) {
	return (
		<button
			className={`p-2 text-${color}-600  focus:outline-none outline-none transition-all hover:bg-${hoverColor}-${hoverWeight} rounded-md ${
				full && " w-full"
			} ${bold && " font-semibold"} ${className}`}
			onClick={!disabled ? onClick : null}
		>
			{loading ? <PulseLoader color="black" size={4} /> : children}
		</button>
	);
}

OpenButton.defaultProps = {
	color: "black",
	full: false,
	bold: false,
	hoverWeight: 100,
	hoverColor: "gray",
	loading: false,
};
