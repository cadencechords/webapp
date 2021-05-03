export default function OpenInput({ placeholder, onFocus, value, onChange }) {
	return (
		<input
			className="outline-none w-full focus:outline-none"
			placeholder={placeholder}
			defaultValue={value}
			onChange={onChange}
			onFocus={onFocus}
		/>
	);
}
