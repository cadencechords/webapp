import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs, { type ConfigType, type Dayjs, type ManipulateType } from 'dayjs';

dayjs.extend(customParseFormat);

/** A day in a `getCalendarDates` week. */
export interface CalendarDate {
  fullDate: Date;
  dateNumber: number;
  isToday: boolean;
}

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function getCalendarDates(
  month = dayjs().month(),
  year = dayjs().year()
) {
  const daysInMonth = dayjs()
    .set('year', year)
    .set('month', month)
    .daysInMonth();
  const calendarWeeks: (CalendarDate | null)[][] = [[], [], [], [], [], []];
  let calendarWeekNumber = 0;

  calendarWeeks[0] = padLeft(month, year);
  for (let day = 1; day <= daysInMonth; ++day) {
    const date = dayjs().set('year', year).set('month', month).date(day);

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

function isNewWeek(date: Dayjs) {
  return date.day() === 0 && date.date() !== 1;
}

function padLeft(month: number, year: number) {
  const startOfMonth = dayjs().set('year', year).set('month', month).date(1);
  let numToPad = startOfMonth.day();
  const firstWeek: null[] = [];

  while (numToPad-- > 0) {
    firstWeek.push(null);
  }

  return firstWeek;
}

function padRight(
  calendarWeek: (CalendarDate | null)[],
  month: number,
  year: number
) {
  const endOfMonth = dayjs()
    .set('year', year)
    .set('month', month)
    .endOf('month');
  const numToPad = 6 - endOfMonth.day();

  for (let i = 0; i < numToPad; ++i) {
    calendarWeek.push(null);
  }

  return calendarWeek;
}

function checkIfIsToday(dateInQuestion: Dayjs) {
  return dateInQuestion.isSame(dayjs());
}

export function isValidHour(hour: string | number) {
  // parseInt converts its argument to a string first; String() does that here.
  hour = parseInt(String(hour));
  return !isNaN(hour) && hour > 0 && hour < 13;
}

export function isValidMinute(minute: string | number) {
  // parseInt converts its argument to a string first; String() does that here.
  minute = parseInt(String(minute));
  return !isNaN(minute) && minute >= 0 && minute < 60;
}

export function isSingleDigitHour(hour: number) {
  return hour > 1 && hour < 10;
}

export function doubleDigitsProvided(hour: number) {
  return hour > 9 && hour < 13;
}

export function isValidTime(time: string) {
  return dayjs(time, ['h:mm A', 'hh:mm A']).isValid();
}

export function combineDateAndTime(
  date: string | null | undefined,
  time: string | null | undefined
) {
  if (date && time) {
    return dayjs(`${date} ${time}`, [
      'YYYY-MM-DD h:mm A',
      'YYYY-MM-DD hh:mm A',
    ]).toDate();
  } else {
    return dayjs(date, 'YYYY-MM-DD').toDate();
  }
}

export function subtractHours(hoursToSubtract: number, date: ConfigType) {
  return dayjs(date).subtract(hoursToSubtract, 'hour');
}

export function getMonthYearFromDate(date: ConfigType) {
  return `${dayjs(date).month()} ${dayjs(date).year()}`;
}

export function isSameDay(date1: ConfigType, date2: ConfigType) {
  return dayjs(date1).isSame(date2, 'date');
}

export function isSameDate(date1: ConfigType, date2: ConfigType) {
  if (!date1 && !date2) return true;
  if (!date1 || !date2) return false;

  return dayjs(date1).isSame(date2);
}

export function getTimeFromDate(date: ConfigType) {
  if (!date) return '';
  date = dayjs(date);
  if (date.hour() !== 0 || date.minute() !== 0) {
    return date.format('h:mma');
  } else {
    return null;
  }
}

export function format(date: ConfigType, format: string | null | undefined) {
  if (!date || !format) return '';

  return dayjs(date).format(format);
}

export function parseHours(date: string | null | undefined) {
  if (!date) return '';

  return date.split(':')[0];
}

export function parseMinutes(date: string | null | undefined) {
  if (!date) return '';
  return date.split(':')[1].slice(0, 2);
}

export function parsePeriod(date: string | null | undefined) {
  if (!date) return '';
  return date.split(' ')[1];
}

export function diffInHours(date1: ConfigType, date2: ConfigType) {
  if (!date1 || !date2) return 0;
  return dayjs(date1).diff(date2, 'hour');
}

export function addToNow(time: number, unit: ManipulateType) {
  return dayjs().add(time, unit).toDate();
}

export function sortDates(dateA: ConfigType, dateB: ConfigType) {
  return dayjs(dateA).isAfter(dayjs(dateB)) ? 1 : -1;
}

export function isPast(date: ConfigType) {
  if (!date) return false;
  return dayjs(date).isBefore(new Date(), 'date');
}
