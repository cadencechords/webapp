export default function PageTitle({ title, editable, onChange, align, placeholder, className }) {
	if (editable) {
		return (
			<input
				className={
					`bg-transparent appearance-none font-bold p-2 text-2xl w-full outline-none ` +
					` focus:outline-none focus:bg-gray-100 hover:bg-gray-100 dark:hover:bg-dark-gray-800 dark:focus:bg-dark-gray-800 rounded transition-colors` +
					` ${className}`
				}
				value={title || ""}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
			/>
		);
	} else {
		return (
			<h1
				className={`p-2 dark:text-dark-gray-100 font-bold flex items-center w-full ${ALIGNMENTS[align]} text-2xl ${className}`}
				id="title"
			>
				{title}
			</h1>
		);
	}
}

PageTitle.defaultProps = {
	editable: false,
	align: "left",
	className: "",
};

const ALIGNMENTS = {
	left: "justify-left",
	center: "justify-center",
	right: "justify-right",
};
