export default function PageTitle({ title, editable, onChange }) {
	if (editable) {
		return (
			<input
				className="my-4 font-bold p-2 text-2xl w-full outline-none focus:outline-none focus:bg-gray-100 hover:bg-gray-100 rounded"
				defaultValue={title}
				onChange={(e) => onChange(e.target.value)}
			/>
		);
	} else {
		return <h1 className="my-4 font-bold flex items-center text-2xl">{title}</h1>;
	}
}

PageTitle.defaultProps = {
	editable: false,
};
