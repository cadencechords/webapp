export default function SongKeyButton({ songKey, onClick, selected }) {
	return (
		<button
			className={
				`outline-none focus:outline-none col-span-1` +
				` rounded-md hover:bg-gray-200 focus:bg-gray-200 transition-all` +
				` py-2 font-semibold` +
				` ${selected ? " ring-blue-300 ring-4 " : ""}` +
				` ${songKey === "" ? " bg-gray-200 cursor-pointer " : " bg-gray-100 "}`
			}
			onClick={onClick}
			disabled={songKey === ""}
		>
			{songKey}
		</button>
	);
}
