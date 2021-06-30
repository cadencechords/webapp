export default function OpenInput({ placeholder, onFocus, value, onChange }) {
	return (
		<input
			className="appearance-none outline-none w-full focus:outline-none bg-transparent"
			placeholder={placeholder}
			defaultValue={value}
			onChange={(e) => onChange(e.target.value)}
			onFocus={onFocus}
		/>
	);
}
