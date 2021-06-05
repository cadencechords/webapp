export default function SectionTitle({ title, underline }) {
	return (
		<h2 className={`my-3 font-semibold text-lg ${underline ? " border-b pb-2" : ""}`}>{title}</h2>
	);
}
