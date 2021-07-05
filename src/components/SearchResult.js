export default function SearchResult({ children, onClick }) {
	return (
		<div
			onClick={onClick}
			className="border-b py-2.5 flex items-center px-2 last:border-0 cursor-pointer bg-white transition-colors hover:bg-gray-50 focus:bg-gray-50"
		>
			{children}
		</div>
	);
}
