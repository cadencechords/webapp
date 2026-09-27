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

import classNames from 'classnames';
import Button from '../Button';

type TimeInputProps = {
  /** Called with a time such as `'7:30 PM'`, or null when it's cleared. */
  onChange?: (time: string | null) => void;
  className?: string;
  /** A time such as `'7:30 PM'`, or null (the event form's cleared time). */
  defaultValue?: string | null;
};

export default function TimeInput({
  onChange,
  className,
  defaultValue,
}: TimeInputProps) {
  // A number once typed; a string when parsed from defaultValue or cleared.
  const [hour, setHour] = useState<number | string>(() =>
    defaultValue ? parseHours(defaultValue) : ''
  );
  const [minute, setMinute] = useState(() =>
    defaultValue ? parseMinutes(defaultValue) : ''
  );
  const [period, setPeriod] = useState<string>(() =>
    defaultValue ? parsePeriod(defaultValue) : 'PM'
  );
  const hourInput = createRef<HTMLInputElement>();
  const minuteInput = createRef<HTMLInputElement>();
  const [isFocused, setIsFocused] = useState(false);

  const [inputClasses] = useState(
    'appearance-none focus:outline-hidden outline-hidden w-10 text-center bg-transparent text-on-surface placeholder:text-on-surface-variant caret-primary '
  );

  const handleHourChange = (typedHour: string) => {
    const potentialHour = parseInt(typedHour);

    if (isNaN(potentialHour)) {
      setHour('');
    } else if (isValidHour(potentialHour)) {
      setHour(potentialHour);
      if (
        isSingleDigitHour(potentialHour) ||
        doubleDigitsProvided(potentialHour)
      ) {
        // Both inputs are mounted while one of them handles a change.
        minuteInput.current!.focus();
      }
    }

    fireOnChangeIfValidTime(potentialHour);
  };

  const handleMinuteChange = (potentialMinute: string) => {
    const parsedMinute = parseInt(potentialMinute);

    if (isNaN(parsedMinute)) {
      setMinute('');
    } else if (isValidMinute(parsedMinute)) {
      setMinute(potentialMinute);
    }

    fireOnChangeIfValidTime(null, potentialMinute);
  };

  const handleTogglePeriod = () => {
    setPeriod(currentPeriod => {
      const newPeriod = currentPeriod === 'AM' ? 'PM' : 'AM';
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

  const fireOnChangeIfValidTime = (
    passedHour: number | null,
    passedMinute?: string | null,
    passedPeriod?: string
  ) => {
    if (!passedHour && !passedMinute && !passedPeriod) {
      onChange?.(null);
    }

    const hourToCheck = passedHour ? passedHour : hour;
    const minuteToCheck = passedMinute ? passedMinute : minute;
    const periodToCheck = passedPeriod ? passedPeriod : period;

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
      // Outlined like OutlinedInput; the focused 2px outline is a 1px border
      // plus a 1px inset shadow, so nothing moves.
      className={classNames(
        'border rounded-extra-small py-2 flex-center min-h-12 px-2 font-plain text-body-large transition-fast-effects',
        isFocused
          ? 'border-primary shadow-[inset_0_0_0_1px_var(--color-primary)]'
          : 'border-outline hover:border-on-surface',
        className
      )}
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
