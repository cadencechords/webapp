export default function OutlinedInput({
	placeholder,
	onBlur,
	onFocus,
	type,
	onChange,
	value
}) {
	return (
		<input
			className="transition-all px-3 py-2 shadow-sm border-gray-300 focus:outline-none outline-none w-full border rounded-md focus:ring-inset focus:ring-2 focus:ring-blue-400"
			placeholder={placeholder}
			onBlur={onBlur}
			onFocus={onFocus}
			type={type}
			onChange={(e) => onChange(e.target.value)}
			autoComplete="off"
			value={value}
			autoCapitalize="off"
		/>
	);
}

OutlinedInput.defaultProps = {
	type: "text",
};
