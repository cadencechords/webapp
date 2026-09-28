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
  /** Floats in the outline's notch, like OutlinedSelect's. */
  label?: string;
};

export default function TimeInput({
  onChange,
  className,
  defaultValue,
  label,
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
      className={classNames(
        'group relative flex-center min-h-12 px-2 font-plain text-body-large',
        className
      )}
    >
      <input
        onChange={e => handleHourChange(e.target.value)}
        className={`${inputClasses}`}
        placeholder="00"
        aria-label={label ? `${label} hour` : 'Hour'}
        inputMode="numeric"
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
        aria-label={label ? `${label} minute` : 'Minute'}
        inputMode="numeric"
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
        className="relative w-11"
      >
        {period}
      </Button>
      {/* The outline, as on OutlinedInput: a fieldset whose legend cuts the
          notch the label sits in. */}
      <fieldset
        aria-hidden="true"
        className={classNames(
          'absolute inset-x-0 bottom-0 -top-[5px] m-0 px-3 min-w-0 text-left rounded-extra-small pointer-events-none transition-fast-effects',
          isFocused
            ? 'border-2 border-primary'
            : 'border border-outline group-hover:border-on-surface'
        )}
      >
        <legend
          className={classNames(
            'invisible h-[11px] p-0 text-body-small whitespace-nowrap overflow-hidden',
            label ? 'max-w-full' : 'max-w-[0.01px]'
          )}
        >
          {label && <span className="px-1">{label}</span>}
        </legend>
      </fieldset>
      {label && (
        <span
          aria-hidden="true"
          className={classNames(
            'absolute left-4 top-0 max-w-[calc(100%-2rem)] truncate origin-top-left -translate-y-[9px] scale-75 pointer-events-none',
            isFocused ? 'text-primary' : 'text-on-surface-variant'
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
