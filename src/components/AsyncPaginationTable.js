import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import ArrowNarrowRightIcon from "@heroicons/react/outline/ArrowNarrowRightIcon";
import Button from "./Button";
import PulseLoader from "react-spinners/PulseLoader";
import TableHead from "./TableHead";
import TableRow from "./TableRow";

export default function AsyncPaginationTable({
	headers,
	rows,
	previousDisabled,
	onNext,
	onPrevious,
	loading,
}) {
	const toColumnsArray = (row) => {
		return Object.values(row);
	};

	return (
		<div>
			<table className="w-full mb-2">
				<TableHead columns={headers} />
				<tbody>
					{rows.map((row, index) => (
						<TableRow key={index} columns={toColumnsArray(row)} />
					))}
				</tbody>
			</table>
			<div className="flex-between">
				<Button
					variant="open"
					color="black"
					size="xs"
					disabled={previousDisabled}
					onClick={onPrevious}
				>
					<div className="flex-center">
						<ArrowNarrowLeftIcon className="w-4 mr-3" /> Previous
					</div>
				</Button>
				{loading && <PulseLoader size="7" color="#1f6feb" />}
				<Button variant="open" color="black" size="xs" bold onClick={onNext}>
					<div className="flex-center">
						Next
						<ArrowNarrowRightIcon className="ml-3 w-4" />
					</div>
				</Button>
			</div>
		</div>
	);
}

AsyncPaginationTable.defaultProps = {
	headers: [],
	rows: [],
};
