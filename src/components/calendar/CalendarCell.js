import CalendarDateButton from "../buttons/CalendarDateButton";
import CalendarEventEntry from "./CalendarEventEntry";

export default function CalendarCell({ date, className, events, onEventClick }) {
	if (date) {
		return (
			<div className={`col-span-1 h-28 w-full p-1 ${className}`}>
				<CalendarDateButton selected={date.isToday} className="mb-2">
					{date.dateNumber}
				</CalendarDateButton>
				{events?.map((event) => (
					<CalendarEventEntry key={event.id} event={event} onClick={onEventClick} />
				))}
			</div>
		);
	} else {
		return <div className={`col-span-1 h-28 w-full py-1 ${className}`}></div>;
	}
}

CalendarCell.defaultProps = {
	className: "",
};
