export default function TransposeOption({ selected, children, className, onClick }) {
	return (
		<button
			onClick={onClick}
			className={
				`focus:outline-none outline-none bg-gray-100 transition-all ` +
				` font-semibold text-lg h-12 w-12 rounded-md block mb-2 flex-center flex-shrink-0` +
				` ${selected ? "bg-blue-600 text-white" : ""} ${className}`
			}
		>
			{children}
		</button>
	);
}

TransposeOption.defaultProps = {
	className: "",
};
