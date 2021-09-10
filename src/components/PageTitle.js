export default function PageTitle({ title, editable, onChange, align }) {
	if (editable) {
		return (
			<input
				className={
					`appearance-none font-bold p-2 text-2xl w-full outline-none ` +
					` focus:outline-none focus:bg-gray-100 hover:bg-gray-100 rounded transition-colors`
				}
				defaultValue={title}
				onChange={(e) => onChange(e.target.value)}
			/>
		);
	} else {
		return (
			<h1 className={`p-2  font-bold flex items-center w-full ${ALIGNMENTS[align]} text-2xl`}>
				{title}
			</h1>
		);
	}
}

PageTitle.defaultProps = {
	editable: false,
	align: "left",
};

const ALIGNMENTS = {
	left: "justify-left",
	center: "justify-center",
	right: "justify-right",
};
