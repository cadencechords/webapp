export default function OpenInput({ placeholder, onFocus, value, onChange, autoFocus }) {
	return (
		<input
			className="appearance-none outline-none w-full focus:outline-none bg-transparent"
			placeholder={placeholder}
			defaultValue={value}
			onChange={(e) => onChange(e.target.value)}
			onFocus={onFocus}
			autoFocus={autoFocus}
			tabIndex={0}
		/>
	);
}

OpenInput.defaultProps = {
	autoFocus: false,
};
