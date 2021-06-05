import TableHead from "./TableHead";
import TableRow from "./TableRow";

export default function Table({ headers, rows }) {
	const toColumnsArray = (row) => {
		return Object.values(row);
	};

	return (
		<table className="w-full">
			<TableHead columns={headers} />
			<tbody>
				{rows.map((row, index) => (
					<TableRow key={index} columns={toColumnsArray(row)} />
				))}
			</tbody>
		</table>
	);
}

Table.defaultProps = {
	headers: [],
	rows: [],
};
