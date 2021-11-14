export default function SectionTitle({ title, underline, className }) {
	return (
		<h2
			className={`mt-3 mb-2 font-semibold text-lg ${
				underline ? " border-b pb-2" : ""
			} ${className}`}
		>
			{title}
		</h2>
	);
}

SectionTitle.defaultProps = {
	className: "",
};
