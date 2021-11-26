export default function DetailTag({ children }) {
	return (
		<span className="rounded-full flex-center text-xs px-2 py-1 shadow-sm border border-gray-300 dark:border-dark-gray-400">
			{children}
		</span>
	);
}
