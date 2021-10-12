import { isValidHour, isValidMinute } from "../utils/date";

import dayjs from "dayjs";

export function isEventValid({ title, date, startTime, endTime }) {
	if (!title || title === "") {
		return false;
	}

	if (!date || !dayjs(date, "yyyy-mm-dd").isValid()) {
		return false;
	}

	if (startTime) {
		let [hour, minute] = startTime.split(":");
		minute = minute.replaceAll("PM", "");
		minute = minute.replaceAll("AM", "");

		if (!isValidHour(hour) || !isValidMinute(minute)) {
			return false;
		}
	}

	if (endTime) {
		let [hour, minute] = endTime.split(":");
		minute = minute.replaceAll("PM", "");
		minute = minute.replaceAll("AM", "");

		if (!isValidHour(hour) || !isValidMinute(minute)) {
			return false;
		}
	}

	return true;
}
