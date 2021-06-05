import AsyncPaginationTable from "./AsyncPaginationTable";
import OpenInput from "./inputs/OpenInput";

const headers = ["", "TITLE", "AUTHOR"];
export default function PlanningCenterSongsTable({
	songs,
	page,
	onNext,
	onPrevious,
	loading,
	query,
	onQueryChange,
}) {
	return (
		<div>
			<OpenInput placeholder="Search for a specific song" value={query} onChange={onQueryChange} />
			<AsyncPaginationTable
				headers={headers}
				rows={songs}
				previousDisabled={page === 0}
				onNext={onNext}
				onPrevious={onPrevious}
				loading={loading}
			/>
		</div>
	);
}
