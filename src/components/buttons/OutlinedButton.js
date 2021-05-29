export default function OutlinedButton({ children, onClick, color, full }) {
	return (
		<button
			onClick={onClick}
			className={
				`border border-gray-300 rounded-md px-3 py-1 outline-none ` +
				` focus:outline-none shadow-sm hover:bg-gray-100 transition-all text-${color}-700 font-semibold text-sm ` +
				`${full ? " w-full py-2" : ""}`
			}
		>
			{children}
		</button>
	);
}

OutlinedButton.defaultProps = {
	color: "black",
};
