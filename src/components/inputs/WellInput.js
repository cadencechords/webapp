export default function WellInput({ onChange, value, placeholder }) {
	return (
		<input
			className={
				"appearance-none bg-gray-200 rounded-md outline-none focus:outline-none w-full px-3 py-2 hover:bg-gray-100 transition-all focus:bg-gray-100"
			}
			placeholder={placeholder}
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
}

WellInput.defaultProps = {
	placeholder: "Search",
};
