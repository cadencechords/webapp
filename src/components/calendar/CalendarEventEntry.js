import { BACKGROUND_COLORS } from "../Button";
import { getTimeFromDate } from "../../utils/date";
import { useState } from "react";

export default function CalendarEventEntry({ event, onClick }) {
	const [colors] = useState(() =>
		event.color ? `${BACKGROUND_COLORS[event.color]} text-white transition-colors` : "text-black"
	);

	return (
		<button
			onClick={() => onClick(event)}
			className={`outline-none focus:outline-none rounded-md px-1 py-0.5 w-full ${colors} text-xs text-left truncate`}
		>
			{getTimeFromDate(event.start_time)} {event.title}
		</button>
	);
}
