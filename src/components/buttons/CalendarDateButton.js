export default function CalendarDateButton({ selected, children, className }) {
	const colorClasses = selected
		? "bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white"
		: "focus:bg-gray-200 hover:bg-gray-200 dark:hover:bg-dark-gray-700 dark:focus:bg-dark-gray-700";
	return (
		<button
			className={`focus:outline-none outline-none rounded-full w-7 h-7 text-sm transition-colors ${colorClasses} ${className}`}
		>
			{children}
		</button>
	);
}
