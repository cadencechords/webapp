export default function TableHead({ columns, editable }) {
	return (
		<thead className="bg-gray-50 text-gray-600 text-xs border-t border-b font-light tracking-wide">
			<tr>
				{columns?.map((column, index) => (
					<th className="py-1 px-2 mx-3 text-left" key={index}>
						{column}
					</th>
				))}

				{editable && <th className="bg-gray-50 border-t border-b"></th>}
			</tr>
		</thead>
	);
}
