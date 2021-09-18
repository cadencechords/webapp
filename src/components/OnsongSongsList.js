import Button from "./Button";
import Checkbox from "./Checkbox";

export default function OnsongsSongsList({
	songs,
	selectedSongs,
	onToggleSong,
	onSelectAll,
	onUnselectAll,
}) {
	const isSelected = (songInQuestion) => {
		return selectedSongs.includes(songInQuestion);
	};

	if (songs) {
		return (
			<>
				<div className="mt-4 font-semibold text-lg">{songs?.length} songs in backup</div>
				<div className="flex-between">
					<div className="my-4 flex gap-4">
						<Button size="xs" variant="open" onClick={onSelectAll}>
							Check all
						</Button>
						<Button size="xs" variant="open" onClick={onUnselectAll}>
							Uncheck all
						</Button>
					</div>
					{selectedSongs?.length} selected
				</div>
				<div className="max-h-96 overflow-y-auto mb-8 bg-gray-50 shadow-inner">
					{songs.map((song) => (
						<div
							className="flex items-center cursor-pointer p-2 border-b last:border-0 select-none"
							key={song.id}
							onClick={() => onToggleSong(!isSelected(song), song)}
						>
							<Checkbox className="mr-2" onChange={() => {}} checked={isSelected(song)} />
							{song.name}
						</div>
					))}
				</div>
			</>
		);
	} else {
		return null;
	}
}
