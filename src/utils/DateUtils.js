export function toShortDate(dateToConvert) {
	if (dateToConvert instanceof String || typeof dateToConvert === "string") {
		dateToConvert = new Date(dateToConvert);
		dateToConvert.setDate(dateToConvert.getDate() + 1);
	}

	let dayOfWeek = DAY_OF_WEEK[dateToConvert.getDay()];
	let monthName = MONTH[dateToConvert.getMonth()];
	let date = dateToConvert.getDate();
	return `${dayOfWeek} ${monthName} ${date}`;
}

export function toMonthYearDate(dateToConvert) {
	if (dateToConvert instanceof String || typeof dateToConvert === "string") {
		dateToConvert = new Date(dateToConvert);
		dateToConvert.setDate(dateToConvert.getDate() + 1);
	}

	let year = dateToConvert.getFullYear();
	let monthName = MONTH[dateToConvert.getMonth()];

	return `${monthName} ${year}`;
}

const DAY_OF_WEEK = {
	0: "Sun",
	1: "Mon",
	2: "Tue",
	3: "Wed",
	4: "Thu",
	5: "Fri",
	6: "Sat",
};

const MONTH = {
	0: "Jan",
	1: "Feb",
	2: "Mar",
	3: "Apr",
	4: "May",
	5: "June",
	6: "July",
	7: "Aug",
	8: "Sep",
	9: "Oct",
	10: "Nov",
	11: "Dec",
};
