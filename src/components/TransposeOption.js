export default function TransposeOption({ selected, children, className, onClick }) {
	return (
		<button
			onClick={onClick}
			className={
				`focus:outline-none outline-none bg-gray-100 dark:bg-dark-gray-600 transition-all ` +
				` font-semibold text-lg h-12 w-12 rounded-md block mb-2 flex-center flex-shrink-0` +
				` ${selected ? "bg-blue-600 dark:bg-dark-blue text-white" : ""} ${className}`
			}
		>
			{children}
		</button>
	);
}

TransposeOption.defaultProps = {
	className: "",
};
