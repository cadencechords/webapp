import SectionTitle from "./SectionTitle";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import { toShortDate } from "../utils/DateUtils";

export default function UpcomingSetsTable({ setlists, onClick }) {
	return (
		<>
			<SectionTitle title="Upcoming" />
			<div className="h-52 overflow-auto">
				<table className="w-full">
					<TableHead columns={["NAME", "SCHEDULED", "SONGS"]} />
					<tbody>
						{setlists.map((setlist) => (
							<TableRow
								key={setlist.id}
								columns={[setlist.name, toShortDate(setlist.scheduled_date), setlist.songs?.length]}
								onClick={() => onClick(setlist.id)}
							/>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}

UpcomingSetsTable.defaultProps = {
	setlists: [],
};
