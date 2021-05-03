import { useHistory } from "react-router";
import TableHead from "./TableHead";
import TableRow from "./TableRow";

export default function SongsTable() {
	const songs = [
		{
			id: 0,
			name: "How Great Thou Art",
			created: new Date().toDateString(),
			binders: "Hymns",
			versions: 1,
			artist: "Charles Spurgeon",
		},
		{
			id: 1,
			name: "Amazing Grace",
			created: new Date(new Date().setDate(-3)).toDateString(),
			binders: "Hymns",
			versions: 2,
			artist: "Augustine",
		},
	];

	const router = useHistory();

	const handleOpenSong = (songId) => {
		router.push(`/app/songs/${songId}`);
	};

	return (
		<>
			<table className="w-full">
				<TableHead
					columns={["NAME", "BINDERS", "CREATED", "VERSIONS"]}
					editable
				/>
				<tbody>
					{songs?.map((song) => (
						<TableRow
							columns={[song.name, song.binders, song.created, song.versions]}
							key={song.id}
							onClick={() => handleOpenSong(song.id)}
						/>
					))}
				</tbody>
			</table>
		</>
	);
}
