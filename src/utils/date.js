import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getCalendarDates(
  month = dayjs().month(),
  year = dayjs().year()
) {
  let daysInMonth = dayjs().set("year", year).set("month", month).daysInMonth();
  let calendarWeeks = [[], [], [], [], [], []];
  let calendarWeekNumber = 0;

  calendarWeeks[0] = padLeft(month, year);
  for (let day = 1; day <= daysInMonth; ++day) {
    let date = dayjs().set("year", year).set("month", month).date(day);

    if (isNewWeek(date)) {
      ++calendarWeekNumber;
    }

    calendarWeeks[calendarWeekNumber].push({
      fullDate: date.toDate(),
      dateNumber: day,
      isToday: checkIfIsToday(date),
    });
  }

  calendarWeeks[4] = padRight(calendarWeeks[4], month, year);
  return calendarWeeks;
}

function isNewWeek(date) {
  return date.day() === 0 && date.date() !== 1;
}

function padLeft(month, year) {
  let startOfMonth = dayjs().set("year", year).set("month", month).date(1);
  let numToPad = startOfMonth.day();
  let firstWeek = [];

  while (numToPad-- > 0) {
    firstWeek.push(null);
  }

  return firstWeek;
}

function padRight(calendarWeek, month, year) {
  let endOfMonth = dayjs().set("year", year).set("month", month).endOf("month");
  let numToPad = 6 - endOfMonth.day();

  for (let i = 0; i < numToPad; ++i) {
    calendarWeek.push(null);
  }

  return calendarWeek;
}

function checkIfIsToday(dateInQuestion) {
  return dateInQuestion.isSame(dayjs());
}

export function isValidHour(hour) {
  hour = parseInt(hour);
  return !isNaN(hour) && hour > 0 && hour < 13;
}

export function isValidMinute(minute) {
  minute = parseInt(minute);
  return !isNaN(minute) && minute >= 0 && minute < 60;
}

export function isSingleDigitHour(hour) {
  return hour > 1 && hour < 10;
}

export function doubleDigitsProvided(hour) {
  return hour > 9 && hour < 13;
}

export function isValidTime(time) {
  return dayjs(time, ["h:mm A", "hh:mm A"]).isValid();
}

export function combineDateAndTime(date, time) {
  if (date && time) {
    return dayjs(`${date} ${time}`, [
      "YYYY-MM-DD h:mm A",
      "YYYY-MM-DD hh:mm A",
    ]).toDate();
  } else {
    return dayjs(date, "YYYY-MM-DD").toDate();
  }
}

export function subtractHours(hoursToSubtract, date) {
  return dayjs(date).subtract(hoursToSubtract, "hour");
}

export function getMonthYearFromDate(date) {
  return `${dayjs(date).month()} ${dayjs(date).year()}`;
}

export function isSameDay(date1, date2) {
  return dayjs(date1).isSame(date2, "date");
}

export function isSameDate(date1, date2) {
  if (!date1 && !date2) return true;
  if (!date1 || !date2) return false;

  return dayjs(date1).isSame(date2);
}

export function getTimeFromDate(date) {
  if (!date) return "";
  date = dayjs(date);
  if (date.hour() !== 0 || date.minute() !== 0) {
    return date.format("h:mma");
  } else {
    return null;
  }
}

export function format(date, format) {
  if (!date || !format) return "";

  return dayjs(date).format(format);
}

export function parseHours(date) {
  if (!date) return "";

  return dayjs(date).format("h");
}

export function parseMinutes(date) {
  if (!date) return "";
  return dayjs(date).format("mm");
}

export function parsePeriod(date) {
  if (!date) return "";
  return dayjs(date).format("A");
}

export function diffInHours(date1, date2) {
  if (!date1 || !date2) return 0;
  return dayjs(date1).diff(date2, "hour");
}

export function addToNow(time, unit) {
  return dayjs().add(time, unit).toDate();
}

export function sortDates(dateA, dateB) {
  return dayjs(dateA).isAfter(dayjs(dateB)) ? 1 : -1;
}

export function isPast(date) {
  if (!date) return false;
  return dayjs(date).isBefore(new Date(), "date");
}
