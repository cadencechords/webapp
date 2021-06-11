export default function PageTitle({ title, editable, onChange, align }) {
	if (editable) {
		return (
			<input
				className={
					`font-bold p-2 text-2xl w-full outline-none ` +
					` focus:outline-none focus:bg-gray-100 hover:bg-gray-100 rounded transition-colors`
				}
				defaultValue={title}
				onChange={(e) => onChange(e.target.value)}
			/>
		);
	} else {
		return (
			<h1 className={`my-4 font-bold flex items-center text-2xl justify-${align}`}>{title}</h1>
		);
	}
}

PageTitle.defaultProps = {
	editable: false,
	align: "left",
};
