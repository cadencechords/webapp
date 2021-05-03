import PencilIcon from "@heroicons/react/solid/PencilIcon";

export default function TableRow({ columns, editable, onClick }) {
	return (
		<tr className="border-b hover:bg-gray-50">
			{columns?.map((column, index) => (
				<td key={index} className="py-2 px-2 mx-3">
					{index === 0 ? (
						<span
							onClick={onClick}
							className="hover:text-purple-700 cursor-pointer"
						>
							{column}
						</span>
					) : (
						column
					)}
				</td>
			))}

			{editable && (
				<td className="py-2 px-2 mx-3">
					<PencilIcon className="text-purple-700 h-4 w-4" />
				</td>
			)}
		</tr>
	);
}
