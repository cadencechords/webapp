import { createRef, useState } from "react";
import {
	doubleDigitsProvided,
	isSingleDigitHour,
	isValidHour,
	isValidMinute,
} from "../../utils/date";

import Button from "../Button";

export default function TimeInput({
	onChange,
	className,
	defaultHours,
	defaultMinutes,
	defaultPeriod,
}) {
	const [hour, setHour] = useState(() => defaultHours || "");
	const [minute, setMinute] = useState(() => defaultMinutes || "");
	const [period, setPeriod] = useState(() => defaultPeriod || "PM");
	const hourInput = createRef();
	const minuteInput = createRef();
	const [isFocused, setIsFocused] = useState(false);

	const [inputClasses] = useState(
		"appearance-none focus:outline-none outline-none w-10 text-center"
	);

	const handleHourChange = (potentialHour) => {
		potentialHour = parseInt(potentialHour);

		if (isNaN(potentialHour)) {
			setHour("");
		} else if (isValidHour(potentialHour)) {
			setHour(potentialHour);
			if (isSingleDigitHour(potentialHour) || doubleDigitsProvided(potentialHour)) {
				minuteInput.current.focus();
			}
		}

		fireOnChangeIfValidTime(potentialHour);
	};

	const handleMinuteChange = (potentialMinute) => {
		let parsedMinute = parseInt(potentialMinute);

		if (isNaN(parsedMinute)) {
			setMinute("");
		} else if (isValidMinute(parsedMinute)) {
			setMinute(potentialMinute);
		}

		fireOnChangeIfValidTime(null, potentialMinute);
	};

	const handleTogglePeriod = () => {
		setPeriod((currentPeriod) => {
			let newPeriod = currentPeriod === "AM" ? "PM" : "AM";
			fireOnChangeIfValidTime(null, null, newPeriod);
			return newPeriod;
		});
	};

	const handleMinuteBlurred = () => {
		if (minute === "" && isValidHour(hour)) {
			setMinute("00");
			fireOnChangeIfValidTime(null, "00");
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
			onChange?.(`${hourToCheck}:${minuteToCheck.toString().padStart(1, "0")} ${periodToCheck}`);
		}
	};

	return (
		<div
			className={
				`border border-gray-300 rounded-md py-2 flex-center shadow-sm px-2` +
				` ${isFocused && "ring-inset ring-2 ring-blue-400"} ${className}`
			}
		>
			<input
				onChange={(e) => handleHourChange(e.target.value)}
				className={`${inputClasses}`}
				placeholder="00"
				value={hour}
				ref={hourInput}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
			/>
			:
			<input
				onChange={(e) => handleMinuteChange(e.target.value)}
				className={`${inputClasses}`}
				placeholder="00"
				value={minute}
				ref={minuteInput}
				onFocus={() => setIsFocused(true)}
				onBlur={handleMinuteBlurred}
			/>
			<Button size="xs" variant="open" color="gray" onClick={handleTogglePeriod} className="w-11">
				{period}
			</Button>
		</div>
	);
}
