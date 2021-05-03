export default function BinderColor({ color, onClick, block, size }) {
	const handleClick = () => {
		if (onClick) {
			onClick(color);
		}
	};

	return (
		<button
			onClick={handleClick}
			className={`h-${size} focus:outline-none outline-none translate-y-6 rounded bg-${color}-400 ${
				block ? " w-full py-3" : "w-" + size
			} ${onClick ? "" : " cursor-default"}`}
		></button>
	);
}

BinderColor.defaultProps = {
	color: "white",
	size: "4",
};
