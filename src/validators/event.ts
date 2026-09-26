import { isValidHour, isValidMinute } from '../utils/date';

import dayjs from 'dayjs';

type EventFields = {
  title?: string;
  /** `YYYY-MM-DD`. */
  date?: string;
  /** `h:mmAM`/`h:mm PM` style times. */
  startTime?: string;
  endTime?: string;
};

export function isEventValid({ title, date, startTime, endTime }: EventFields) {
  if (!title || title === '') {
    return false;
  }

  if (!date || !dayjs(date, 'yyyy-mm-dd').isValid()) {
    return false;
  }

  if (startTime) {
    const [hour, minuteAndPeriod] = startTime.split(':');
    const minute = minuteAndPeriod.replaceAll('PM', '').replaceAll('AM', '');

    if (!isValidHour(hour) || !isValidMinute(minute)) {
      return false;
    }
  }

  if (endTime) {
    const [hour, minuteAndPeriod] = endTime.split(':');
    const minute = minuteAndPeriod.replaceAll('PM', '').replaceAll('AM', '');

    if (!isValidHour(hour) || !isValidMinute(minute)) {
      return false;
    }
  }

  return true;
}
