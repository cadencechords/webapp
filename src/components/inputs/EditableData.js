export default function EditableData({ value, onChange, placeholder, centered, onClick }) {
	return (
		<input
			className={
				`appearance-none p-1 w-full sm:text-sm text-base outline-none focus:outline-none ` +
				` focus:bg-gray-100 hover:bg-gray-100 rounded bg-transparent transition-colors ` +
				` ${centered ? " text-center " : ""}`
			}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			onClick={onClick}
		/>
	);
}

EditableData.defaultProps = {
	centered: false,
};
