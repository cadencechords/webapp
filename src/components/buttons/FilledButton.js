import PulseLoader from "react-spinners/PulseLoader";

export default function FilledButton({ children, color, onClick, full, bold, loading, disabled }) {
	// prettier-ignore
	let disabledStyles = disabled ? " cursor-default bg-gray-100 text-gray-600" :" bg-" + color + "-600 hover:bg-" + color + "-800 focus:bg-" + color + "-800 text-white";
	let widthStyles = full ? " w-full" : "";
	let boldStyles = bold ? " font-semibold" : "";

	return (
		<button
			className={`${widthStyles} ${boldStyles} ${disabledStyles} focus:outline-none shadow-sm outline-none transition-all rounded-md px-4 text-sm py-2 `}
			onClick={!disabled ? onClick : null}
		>
			{loading ? <PulseLoader color="white" size={8} /> : children}
		</button>
	);
}

FilledButton.defaultProps = {
	color: "blue",
	loading: false,
	disabled: false,
};
