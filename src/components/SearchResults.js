import { useHistory } from "react-router-dom";
import NoDataMessage from "./NoDataMessage";
import SearchResult from "./SearchResult";

export default function SearchResults({ results }) {
	const router = useHistory();

	if (results) {
		let binders = results.binders?.map((binder) => (
			<SearchResult key={binder.name} onClick={() => router.push(`/binders/${binder.id}`)}>
				{binder.name}
			</SearchResult>
		));
		let songs = results.songs?.map((song) => (
			<SearchResult key={song.id} onClick={() => router.push(`/songs/${song.id}`)}>
				{song.name}
			</SearchResult>
		));
		let setlists = results.setlists?.map((setlist) => (
			<SearchResult key={setlist.id} onClick={() => router.push(`/sets/${setlist.id}`)}>
				{setlist.name}
			</SearchResult>
		));
		return (
			<div className="mt-4 px-2">
				<section className="mb-4">
					<h3 className="font-semibold mb-1">Binders</h3>
					{binders.length === 0 ? <NoDataMessage>No binders found</NoDataMessage> : binders}
				</section>
				<section className="mb-4">
					<h3 className="font-semibold mb-1">Songs</h3>
					{songs.length === 0 ? <NoDataMessage>No songs found</NoDataMessage> : songs}
				</section>
				<section>
					<h3 className="font-semibold mb-1">Sets</h3>
					{setlists.length === 0 ? <NoDataMessage>No sets found</NoDataMessage> : setlists}
				</section>
			</div>
		);
	} else {
		return (
			<div className="text-center px-4 text-gray-600 mt-10">
				Try typing in the search bar to find something in your library
			</div>
		);
	}
}
