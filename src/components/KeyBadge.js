export default function KeyBadge({ songKey }) {
	if (songKey) {
		return (
			<span className="text-xs font-bold text-gray-700 bg-gray-200 py-0.5 px-1 rounded-md flex-grow-0">
				{songKey}
			</span>
		);
	} else {
		return null;
	}
}
