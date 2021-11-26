export default function KeyBadge({ songKey }) {
	if (songKey) {
		return (
			<span className="text-xs font-bold text-gray-700 dark:text-dark-gray-200 bg-gray-200 dark:bg-dark-gray-400 dark:border-dark-gray-200 py-0.5 px-1 rounded-md flex-grow-0 ml-2">
				{songKey}
			</span>
		);
	} else {
		return null;
	}
}
