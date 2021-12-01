import Label from "../Label";
import PropTypes from "prop-types";
import PulseLoader from "react-spinners/PulseLoader";
import React from "react";

const OutlinedInput = React.forwardRef(
	(
		{
			placeholder,
			onBlur,
			onFocus,
			type,
			onChange,
			value,
			label,
			button,
			onButtonClick,
			buttonLoading,
			className,
			onEnter,
		},
		ref
	) => {
		let roundedClasses = button ? " rounded-l-md " : " rounded-md ";

		const handleOnKeyUp = (e) => {
			if (e.keyCode === 13) {
				onEnter?.();
			}
		};

		return (
			<>
				{label && <Label>{label}</Label>}
				<div className="flex">
					<input
						className={`dark:bg-dark-gray-700 appearance-none transition-all px-3 py-2 shadow-sm border-gray-300 dark:border-dark-gray-400 focus:outline-none outline-none w-full border ${roundedClasses} focus:ring-inset focus:ring-2 focus:ring-blue-400 ${className}`}
						placeholder={placeholder}
						onBlur={onBlur}
						onFocus={onFocus}
						type={type}
						onChange={(e) => onChange(e.target.value)}
						autoComplete="off"
						value={value}
						autoCapitalize="off"
						pattern={type.toLowerCase() === "date" ? "d{4}-d{2}-d{2}" : ""}
						onKeyUp={handleOnKeyUp}
						ref={ref}
					/>

					{button && (
						<button
							className={
								"rounded-r-md border-gray-300 dark:border-dark-gray-400 border border-l-0 px-2 bg-gray-50 dark:bg-dark-gray-400 " +
								" focus:outline-none outline-none transition-all font-semibold text-sm " +
								" text-gray-600 dark:text-dark-gray-200 " +
								`${buttonLoading ? " w-20 cursor-wait " : " hover:bg-gray-200 focus:bg-gray-200"}`
							}
							onClick={!buttonLoading ? onButtonClick : null}
						>
							{buttonLoading ? <PulseLoader size={4} color="gray" /> : button}
						</button>
					)}
				</div>
			</>
		);
	}
);

OutlinedInput.defaultProps = {
	type: "text",
};

OutlinedInput.propTypes = {
	onChange: PropTypes.func.isRequired,
};

export default OutlinedInput;
