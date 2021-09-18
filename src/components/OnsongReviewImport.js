import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import Button from "./Button";

export default function OnsongReviewImport({
	selectedBinder,
	selectedSongs,
	onBackClick,
	onConfirm,
}) {
	return (
		<>
			<div>
				<h2 className="text-2xl font-semibold mb-4">Importing {selectedSongs?.length} songs</h2>
				<div className="mb-4 max-h-96 overflow-y-auto bg-gray-50 shadow-inner">
					{selectedSongs?.map((song) => (
						<div key={song.id} className="p-2 border-b last:border-0">
							{song.name}
						</div>
					))}
				</div>
				{selectedBinder && (
					<h2 className="mb-4 text-2xl font-semibold">Into the "{selectedBinder.name}" binder</h2>
				)}
			</div>
			<div className="flex-between">
				<Button variant="open" color="gray" bold onClick={onBackClick}>
					<div className="flex-center">
						<ArrowNarrowLeftIcon className="w-5 h-5 mr-2" /> Back
					</div>
				</Button>
				<Button onClick={onConfirm}>
					<div className="flex-center">Import!</div>
				</Button>
			</div>
		</>
	);
}
