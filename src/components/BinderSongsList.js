import SectionTitle from "./SectionTitle";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import FilledButton from "./buttons/FilledButton";
import { useState } from "react";
import SearchSongsDialog from "./SearchSongsDialog";
import { useHistory } from "react-router";

export default function BinderSongsList() {
	const songs = [
		{
			name: "How Great Thou Art",
			categories: "praise, worship",
			versions: [{}],
			id: 0,
		},
		{
			name: "Be Thou My Vision",
			categories: "trust",
			versions: [{}, {}],
			id: 1,
		},
		{
			name: "Amazing Grace",
			categories: "grace, forgiveness, gospel",
			versions: [{}, {}, {}],
			id: 2,
		},
	];

	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const router = useHistory();

	const handleOpenSong = (songId) => {
		router.push(`/app/songs/${songId}`);
	};

	return (
		<>
			<div className="flex justify-between mb-4 items-end">
				<SectionTitle title="Songs in this binder" />
				<FilledButton onClick={() => setIsSearchOpen(true)} color="blue">
					Add Songs
				</FilledButton>
			</div>
			<table className="w-full">
				<TableHead columns={["NAME", "CATEGORIES", "VERSIONS"]} />
				<tbody>
					{songs?.map((song) => (
						<TableRow
							columns={[song.name, song.categories, song.versions.length]}
							key={song.id}
							onClick={() => handleOpenSong(song.id)}
						/>
					))}
				</tbody>
			</table>

			<SearchSongsDialog
				open={isSearchOpen}
				onCloseDialog={() => setIsSearchOpen(false)}
			/>
		</>
	);
}
