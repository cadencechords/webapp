import Checkbox from "./Checkbox";
import Table from "./Table";

const HEADERS = ["", "TITLE", "AUTHOR"];
export default function SelectedPcoSongsTable({ songsToImport, onRemove }) {
	const songRows = songsToImport.map((song) => ({
		checkbox: <Checkbox checked={true} onChange={() => onRemove(song)} />,
		title: song.title,
		author: song.author,
	}));

	return <Table headers={HEADERS} rows={songRows} />;
}

SelectedPcoSongsTable.defaultProps = {
	songsToImport: [],
};
