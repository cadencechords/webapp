export default function SidenavLink({ text, active }) {
	return (
		<a
			href="#"
			className={` rounded py-2 px-3 w-full my-0.5 font-semibold ${
				active ? "bg-gray-900 text-gray-100 rounded" : "text-gray-300"
			}`}
		>
			{text}
		</a>
	);
}
