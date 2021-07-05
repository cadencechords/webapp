import { useCallback, useEffect, useState } from "react";
import PlanningCenterApi from "../api/PlanningCenterApi";
import Checkbox from "../components/Checkbox";
import PageTitle from "../components/PageTitle";
import PlanningCenterSongsTable from "../components/PlanningCenterSongsTable";
import SectionTitle from "../components/SectionTitle";
import SelectedPcoSongsTable from "../components/SelectedPcoSongsTable";
import { pluralOrSingularize } from "../utils/FormatUtils";
import _ from "lodash";
import Button from "../components/Button";

const NUMBER_PER_PAGE = 25;

export default function PcoSongsIndexPage() {
	const [loadingSongs, setLoadingSongs] = useState(true);
	const [songs, setSongs] = useState([]);
	const [songsToImport, setSongsToImport] = useState([]);
	const [page, setPage] = useState(0);
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [importing, setImporting] = useState(false);

	useEffect(() => {
		async function fetchSongs() {
			setLoadingSongs(true);
			try {
				let offset = page * NUMBER_PER_PAGE;
				let { data } = await PlanningCenterApi.getSongs(offset, debouncedQuery);
				setSongs(data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingSongs(false);
			}
		}

		fetchSongs();
	}, [page, debouncedQuery]);

	const handleChecked = (shouldImport, song) => {
		if (shouldImport) {
			setSongsToImport([...songsToImport, song]);
		} else {
			let updatedImportsList = songsToImport.filter((songToImport) => songToImport.id !== song.id);
			setSongsToImport(updatedImportsList);
		}
	};

	const songIncludedToBeImported = (song) => {
		let indexOfSong = songsToImport.findIndex((songToImport) => songToImport.id === song.id);

		return indexOfSong !== -1;
	};

	const handleQueryChange = (newQuery) => {
		setQuery(newQuery);
		debounce(newQuery);
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debounce = useCallback(
		_.debounce((query) => {
			setPage(0);
			setDebouncedQuery(query);
		}, 200),
		[]
	);

	const handleImportSongs = async () => {
		setImporting(true);
		try {
			let songIdsToImport = songsToImport.map((song) => song.id);
			await PlanningCenterApi.importSongs(songIdsToImport);
			setSongsToImport([]);
		} catch (error) {
			console.log(error);
		} finally {
			setImporting(false);
		}
	};

	const songRows = songs.map((song) => ({
		checkbox: (
			<Checkbox
				checked={songIncludedToBeImported(song)}
				onChange={(checked) => handleChecked(checked, song)}
			/>
		),
		title: song.title,
		author: song.author,
	}));
	return (
		<>
			<PageTitle title="Import songs from Planning Center" />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-14">
				<div>
					<SectionTitle title="Planning Center songs" />
					<PlanningCenterSongsTable
						songs={songRows}
						page={page}
						onNext={() => setPage((page) => page + 1)}
						onPrevious={() => setPage((page) => page - 1)}
						loading={loadingSongs}
						query={query}
						onQueryChange={handleQueryChange}
					/>
				</div>
				<div>
					<div className="md:pb-6">
						<SectionTitle title="Selected songs" />
					</div>
					<SelectedPcoSongsTable
						songsToImport={songsToImport}
						onRemove={(songToRemove) => handleChecked(false, songToRemove)}
					/>
				</div>
			</div>

			<Button
				disabled={songsToImport.length === 0}
				loading={importing}
				onClick={handleImportSongs}
				className="fixed bottom-16 right-4 md:right-6 md:bottom-6"
			>
				Import {songsToImport.length} {pluralOrSingularize("song", songsToImport)}
			</Button>
		</>
	);
}
