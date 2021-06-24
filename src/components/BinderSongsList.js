import SectionTitle from "./SectionTitle";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import { useState } from "react";
import SearchSongsDialog from "./SearchSongsDialog";
import { useHistory } from "react-router";
import Button from "./Button";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import PlusCircleIcon from "@heroicons/react/solid/PlusCircleIcon";

export default function BinderSongsList({ boundSongs, onAdd, onRemoveSong, songsBeingRemoved }) {
	const [showSearchDialog, setShowSearchDialog] = useState(false);
	const router = useHistory();

	const handleOpenSong = (songId) => {
		router.push(`/app/songs/${songId}`);
	};

	return (
		<>
			<div className="sm:block hidden">
				<div className="flex justify-between mb-2 items-center">
					<SectionTitle title="Songs in this binder" />
					<Button
						variant="open"
						size="xs"
						onClick={() => setShowSearchDialog(true)}
						bold
						color="blue"
					>
						Add Songs
					</Button>
				</div>
				<table className="w-full">
					<TableHead columns={["NAME", ""]} />

					<tbody>
						{boundSongs?.map((song) => (
							<TableRow
								columns={[song.name]}
								key={song.id}
								onClick={() => handleOpenSong(song.id)}
								removable
								onRemove={() => onRemoveSong(song)}
								removing={songsBeingRemoved.includes(song.id)}
							/>
						))}
					</tbody>
				</table>
			</div>

			<div className="sm:hidden">
				<SectionTitle title="Songs in this binder" />
				{boundSongs.map((song) => (
					<div className="border-b py-2.5 flex justify-between items-center px-2 last:border-0 cursor-pointer bg-white transition-colors hover:bg-gray-50 focus:bg-gray-50">
						<div key={song.id} onClick={() => handleOpenSong(song.id)}>
							<div className="overflow-hidden overflow-ellipsis whitespace-nowrap">{song.name}</div>
						</div>
						<Button
							variant="open"
							color="black"
							size="xs"
							onClick={() => onRemoveSong(song)}
							removing={songsBeingRemoved.includes(song.id)}
						>
							<TrashIcon className="h-4 w-4" />
						</Button>
					</div>
				))}
			</div>
			<SearchSongsDialog
				open={showSearchDialog}
				onCloseDialog={() => setShowSearchDialog(false)}
				onAdd={onAdd}
				boundSongs={boundSongs}
			/>
			<Button
				variant="open"
				className="fixed bottom-12 left-0 rounded-none flex items-center justify-center sm:hidden h-12"
				full
				style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px -5px 17px 0px" }}
				onClick={() => setShowSearchDialog(true)}
			>
				<PlusCircleIcon className="h-4 w-4 mr-2 text-blue-700" />
				Add more songs
			</Button>
		</>
	);
}
