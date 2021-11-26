import Button from "../Button";
import ChevronLeftIcon from "@heroicons/react/outline/ChevronLeftIcon";
import ChevronRightIcon from "@heroicons/react/outline/ChevronRightIcon";
import PlusIcon from "@heroicons/react/outline/PlusIcon";

export default function CalendarHeader({
	title,
	onNextMonth,
	onPreviousMonth,
	onCreateEvent,
	canCreate,
}) {
	return (
		<>
			<div className="flex-between mb-4">
				<div className="flex-center gap-2">
					<h1 className="text-2xl font-semibold w-48">{title}</h1>
					<Button variant="open" color="gray" onClick={onPreviousMonth}>
						<ChevronLeftIcon className="w-5 h-5" />
					</Button>
					<Button variant="open" color="gray" onClick={onNextMonth}>
						<ChevronRightIcon className="w-5 h-5" />
					</Button>
				</div>
				{canCreate && (
					<Button onClick={onCreateEvent}>
						<div className="flex-center">
							<PlusIcon className="w-4 h-4 mr-1" />
							Add
						</div>
					</Button>
				)}
			</div>
			<div className="grid grid-cols-7 text-gray-600 dark:text-dark-gray-200 mb-2 text-center">
				<div className="col-span-1">Su</div>
				<div className="col-span-1">Mo</div>
				<div className="col-span-1">Tu</div>
				<div className="col-span-1">We</div>
				<div className="col-span-1">Th</div>
				<div className="col-span-1">Fr</div>
				<div className="col-span-1">Sa</div>
			</div>
		</>
	);
}
