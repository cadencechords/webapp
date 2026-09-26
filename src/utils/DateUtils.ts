import dayjs, { type ConfigType } from 'dayjs';

export function toMonthYearDate(dateToConvert: string | Date) {
  if (dateToConvert instanceof String || typeof dateToConvert === 'string') {
    // `String()` unwraps a `String` object, as `new Date` already did.
    dateToConvert = new Date(String(dateToConvert));
    dateToConvert.setDate(dateToConvert.getDate() + 1);
  }

  const year = dateToConvert.getFullYear();
  const monthName = MONTH[dateToConvert.getMonth()];

  return `${monthName} ${year}`;
}

const MONTH: Record<number, string> = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
};

export function format(format: string, date?: ConfigType) {
  return dayjs(date).format(format);
}
