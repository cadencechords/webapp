export default function NoDataMessage({ type }) {
	return (
		<div className="text-center p-10 bg-gray-100 rounded-md">
			No {type}s to show
		</div>
	);
}
