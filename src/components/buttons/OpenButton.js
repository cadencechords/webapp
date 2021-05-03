export default function OpenButton({
	children,
	color,
	onClick,
	full,
	bold,
	hoverWeight,
	hoverColor,
}) {
	return (
		<button
			className={`p-2 text-${color}-600  focus:outline-none outline-none transition-all hover:bg-${hoverColor}-${hoverWeight} rounded-md ${
				full && " w-full text-left"
			} ${bold && " font-semibold"}`}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

OpenButton.defaultProps = {
	color: "black",
	full: false,
	bold: false,
	hoverWeight: 100,
	hoverColor: "gray",
};
