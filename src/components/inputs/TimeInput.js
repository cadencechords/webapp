import { createRef, useState } from 'react';
import {
  doubleDigitsProvided,
  isSingleDigitHour,
  isValidHour,
  isValidMinute,
  parseHours,
  parseMinutes,
  parsePeriod,
} from '../../utils/date';

import Button from '../Button';

export default function TimeInput({ onChange, className, defaultValue }) {
  const [hour, setHour] = useState(() =>
    defaultValue ? parseHours(defaultValue) : ''
  );
  const [minute, setMinute] = useState(() =>
    defaultValue ? parseMinutes(defaultValue) : ''
  );
  const [period, setPeriod] = useState(() =>
    defaultValue ? parsePeriod(defaultValue) : 'PM'
  );
  const hourInput = createRef();
  const minuteInput = createRef();
  const [isFocused, setIsFocused] = useState(false);

  const [inputClasses] = useState(
    'appearance-none focus:outline-none outline-none w-10 text-center dark:bg-transparent '
  );

  const handleHourChange = potentialHour => {
    potentialHour = parseInt(potentialHour);

    if (isNaN(potentialHour)) {
      setHour('');
    } else if (isValidHour(potentialHour)) {
      setHour(potentialHour);
      if (
        isSingleDigitHour(potentialHour) ||
        doubleDigitsProvided(potentialHour)
      ) {
        minuteInput.current.focus();
      }
    }

    fireOnChangeIfValidTime(potentialHour);
  };

  const handleMinuteChange = potentialMinute => {
    let parsedMinute = parseInt(potentialMinute);

    if (isNaN(parsedMinute)) {
      setMinute('');
    } else if (isValidMinute(parsedMinute)) {
      setMinute(potentialMinute);
    }

    fireOnChangeIfValidTime(null, potentialMinute);
  };

  const handleTogglePeriod = () => {
    setPeriod(currentPeriod => {
      let newPeriod = currentPeriod === 'AM' ? 'PM' : 'AM';
      fireOnChangeIfValidTime(null, null, newPeriod);
      return newPeriod;
    });
  };

  const handleMinuteBlurred = () => {
    if (minute === '' && isValidHour(hour)) {
      setMinute('00');
      fireOnChangeIfValidTime(null, '00');
    }
    setIsFocused(false);
  };

  const fireOnChangeIfValidTime = (passedHour, passedMinute, passedPeriod) => {
    if (!passedHour && !passedMinute && !passedPeriod) {
      onChange?.(null);
    }

    let hourToCheck = passedHour ? passedHour : hour;
    let minuteToCheck = passedMinute ? passedMinute : minute;
    let periodToCheck = passedPeriod ? passedPeriod : period;

    if (isValidHour(hourToCheck) && isValidMinute(minuteToCheck)) {
      onChange?.(
        `${hourToCheck}:${minuteToCheck
          .toString()
          .padStart(1, '0')} ${periodToCheck}`
      );
    }
  };

  return (
    <div
      className={
        `border transition-all border-gray-300 dark:border-dark-gray-400 dark:bg-dark-gray-700 rounded-md py-2 flex-center h-10 shadow-sm px-2` +
        ` ${
          isFocused &&
          'ring-offset-2 ring-2 ring-blue-400 ring-offset-dark-gray-700'
        } ${className}`
      }
    >
      <input
        onChange={e => handleHourChange(e.target.value)}
        className={`${inputClasses}`}
        placeholder="00"
        value={hour}
        ref={hourInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      :
      <input
        onChange={e => handleMinuteChange(e.target.value)}
        className={`${inputClasses}`}
        placeholder="00"
        value={minute}
        ref={minuteInput}
        onFocus={() => setIsFocused(true)}
        onBlur={handleMinuteBlurred}
      />
      <Button
        size="xs"
        variant="open"
        color="gray"
        onClick={handleTogglePeriod}
        className="w-11"
      >
        {period}
      </Button>
    </div>
  );
}
