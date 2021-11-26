import CalendarCell from "./CalendarCell";
import { isSameDay } from "../../utils/date";

export default function CalendarRow({ days, events, className, onEventClick }) {
	function findEventsForDay(day) {
		if (day && events) {
			return events.filter((event) => isSameDay(event.start_time, day.fullDate));
		} else {
			return [];
		}
	}

	return (
		<div className={`grid grid-cols-7 ${className}`}>
			<CalendarCell
				date={days[0]}
				className="border-r dark:border-dark-gray-600"
				events={findEventsForDay(days[0])}
				onEventClick={onEventClick}
			/>
			<CalendarCell
				date={days[1]}
				className="border-r dark:border-dark-gray-600"
				events={findEventsForDay(days[1])}
				onEventClick={onEventClick}
			/>
			<CalendarCell
				date={days[2]}
				className="border-r dark:border-dark-gray-600"
				events={findEventsForDay(days[2])}
				onEventClick={onEventClick}
			/>
			<CalendarCell
				date={days[3]}
				className="border-r dark:border-dark-gray-600"
				events={findEventsForDay(days[3])}
				onEventClick={onEventClick}
			/>
			<CalendarCell
				date={days[4]}
				className="border-r dark:border-dark-gray-600"
				events={findEventsForDay(days[4])}
				onEventClick={onEventClick}
			/>
			<CalendarCell
				date={days[5]}
				className="border-r dark:border-dark-gray-600"
				events={findEventsForDay(days[5])}
				onEventClick={onEventClick}
			/>
			<CalendarCell date={days[6]} events={findEventsForDay(days[6])} onEventClick={onEventClick} />
		</div>
	);
}
