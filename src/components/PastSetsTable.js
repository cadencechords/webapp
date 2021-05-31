import SectionTitle from "./SectionTitle";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import { toShortDate } from "../utils/DateUtils";

export default function PastSetsTable({ setlists }) {
	return (
		<>
			<SectionTitle title="Previous" />
			<div className="h-52">
				<table className="w-full">
					<TableHead columns={["NAME", "SCHEDULED", "SONGS"]} />
					<tbody>
						{setlists.map((setlist) => (
							<TableRow
								key={setlist.id}
								columns={[setlist.name, toShortDate(setlist.scheduled_date), setlist.songs?.length]}
							/>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}

PastSetsTable.defaultProps = {
	setlists: [],
};
