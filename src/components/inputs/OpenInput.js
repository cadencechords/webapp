export default function OpenInput({ placeholder, onFocus, value, onChange, autoFocus, className }) {
	return (
		<input
			className={`appearance-none outline-none w-full focus:outline-none bg-transparent ${className}`}
			placeholder={placeholder}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			onFocus={onFocus}
			autoFocus={autoFocus}
			tabIndex={0}
		/>
	);
}

OpenInput.defaultProps = {
	autoFocus: false,
	className: "",
};
