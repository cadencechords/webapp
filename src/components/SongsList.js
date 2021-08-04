import { useHistory } from "react-router-dom";
import ExclamationIcon from "@heroicons/react/outline/ExclamationIcon";

import TableHead from "./TableHead";
import TableRow from "./TableRow";
import KeyBadge from "./KeyBadge";

export default function SongsList({ songs }) {
	const router = useHistory();
	const exclamationIcon = <ExclamationIcon className="h-4 w-4 text-gray-600 mr-2" />;

	const handleOpenSong = (songId) => {
		router.push(`/songs/${songId}`);
	};

	return (
		<>
			<div className="hidden sm:block">
				<table className="w-full">
					<TableHead columns={["NAME", "BINDERS", "CREATED"]} editable />
					<tbody>
						{songs?.map((song) => {
							let binders = song.binders?.length > 0 ? concatBinderNames(song.binders) : "-";
							let songNameAndKey = (
								<div className="flex items-center gap-2">
									{song.name}
									<KeyBadge songKey={song.original_key} />
								</div>
							);
							return (
								<TableRow
									columns={[songNameAndKey, binders, new Date(song.created_at).toDateString()]}
									key={song.id}
									onClick={() => handleOpenSong(song.id)}
								/>
							);
						})}
					</tbody>
				</table>
			</div>
			<div className="sm:hidden">
				{songs.map((song) => (
					<div
						key={song.id}
						className="border-b py-2.5 flex items-center px-2 last:border-0 cursor-pointer bg-white transition-colors hover:bg-gray-50 focus:bg-gray-50"
					>
						{!song?.content && exclamationIcon}
						<div
							className="overflow-hidden overflow-ellipsis whitespace-nowrap flex items-center gap-2"
							onClick={() => router.push(`/songs/${song.id}`)}
						>
							{song.name}
							<KeyBadge songKey={song.original_key} />
						</div>
					</div>
				))}
			</div>
		</>
	);
}

function concatBinderNames(binders) {
	let names = binders.map((binder) => binder.name);
	return names.join(", ");
}
