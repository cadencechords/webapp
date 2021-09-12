export default function SectionTitle({ title, underline }) {
	return (
		<h2 className={`mt-3 mb-2 font-semibold text-lg ${underline ? " border-b pb-2" : ""}`}>
			{title}
		</h2>
	);
}
