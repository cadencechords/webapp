import PencilIcon from "@heroicons/react/solid/PencilIcon";
import TrashIcon from "@heroicons/react/outline/TrashIcon";
import OpenButton from "./buttons/OpenButton";

export default function TableRow({
	columns,
	editable,
	onClick,
	removable,
	onRemove,
	removing,
	actions,
}) {
	return (
		<tr className="border-b hover:bg-gray-50">
			{columns?.map((column, index) => (
				<td key={index} className="py-2 px-2 mx-3">
					{index === 0 ? (
						<span onClick={onClick} className="hover:text-purple-700 cursor-pointer">
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

			{removable && (
				<td className="text-right pr-4">
					<OpenButton onClick={onRemove} loading={removing} color="grey" disabled={removing}>
						<TrashIcon className="h-4 w-4 text-gray-600" />
					</OpenButton>
				</td>
			)}
			{actions && <td>{actions}</td>}
		</tr>
	);
}

TableRow.defaultProps = {
	removable: false,
};
