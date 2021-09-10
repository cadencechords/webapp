export default function EditableData({
	value,
	onChange,
	placeholder,
	centered,
	onClick,
	className,
	type,
	editable,
}) {
	if (editable) {
		return (
			<input
				className={
					`appearance-none p-1 w-full sm:text-sm text-base outline-none focus:outline-none ` +
					` focus:bg-gray-100 hover:bg-gray-100 rounded bg-transparent transition-colors ` +
					` ${centered ? " text-center " : ""}` +
					` ${className} `
				}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				onClick={onClick}
				type={type}
			/>
		);
	} else {
		return <div className="p-1 w-full sm:text-sm text-base">{value || "None provided"}</div>;
	}
}

EditableData.defaultProps = {
	centered: false,
	type: "text",
	editable: true,
};
