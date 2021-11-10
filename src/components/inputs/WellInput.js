export default function WellInput({ onChange, value, placeholder, autoFocus, className, id }) {
	return (
		<input
			className={`appearance-none bg-gray-100 rounded-md outline-none focus:outline-none w-full px-3 py-2 hover:bg-gray-200 transition-all focus:bg-gray-200 ${className}`}
			placeholder={placeholder}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			autoFocus={autoFocus}
			id={id}
		/>
	);
}

WellInput.defaultProps = {
	placeholder: "Search",
	autoFocus: false,
	className: "",
	id: "",
};
