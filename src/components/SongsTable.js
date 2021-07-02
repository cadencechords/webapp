import { useHistory } from "react-router";
import TableHead from "./TableHead";
import TableRow from "./TableRow";

export default function SongsTable({ songs }) {
	const router = useHistory();

	const handleOpenSong = (songId) => {
		router.push(`/songs/${songId}`);
	};

	return (
		<>
			<table className="w-full">
				<TableHead columns={["NAME", "BINDERS", "CREATED"]} editable />
				<tbody>
					{songs?.map((song) => {
						let binders = song.binders?.length > 0 ? concatBinderNames(song.binders) : "-";
						return (
							<TableRow
								columns={[song.name, binders, new Date(song.created_at).toDateString()]}
								key={song.id}
								onClick={() => handleOpenSong(song.id)}
							/>
						);
					})}
				</tbody>
			</table>
		</>
	);
}

function concatBinderNames(binders) {
	let names = binders.map((binder) => binder.name);
	return names.join(", ");
}
