import dayjs from 'dayjs';

export function toMonthYearDate(dateToConvert) {
  if (dateToConvert instanceof String || typeof dateToConvert === 'string') {
    dateToConvert = new Date(dateToConvert);
    dateToConvert.setDate(dateToConvert.getDate() + 1);
  }

  let year = dateToConvert.getFullYear();
  let monthName = MONTH[dateToConvert.getMonth()];

  return `${monthName} ${year}`;
}

const MONTH = {
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

export function format(format, date) {
  return dayjs(date).format(format);
}
