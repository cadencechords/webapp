import { useHistory } from "react-router";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import BinderColor from "./BinderColor";

export default function BindersTable() {
	const router = useHistory();
	const binders = [
		{
			name: (
				<div className="flex items-center">
					<BinderColor color="purple" />
					<span className="ml-2">Hymns</span>
				</div>
			),
			numSongs: 30,
			created: new Date().toDateString(),
			id: 0,
		},
		{
			name: (
				<div className="flex items-center">
					<BinderColor color="red" />
					<span className="ml-2">Ukrainian Hymns</span>
				</div>
			),
			numSongs: 900,
			created: new Date(new Date().setDate(-40)).toDateString(),
			id: 1,
			color: "red",
		},
		{
			name: "Russian Hymns",
			numSongs: 200,
			created: new Date(new Date().setDate(-23)).toDateString(),
			id: 2,
			color: "green",
		},
	];

	const handleOpenBinder = (binderId) => {
		router.push(`/app/binders/${binderId}`);
	};

	return (
		<>
			<table className="w-full">
				<TableHead columns={["NAME", "NUMBER OF SONGS", "CREATED"]} editable />
				<tbody>
					{binders?.map((binder) => (
						<TableRow
							columns={[binder.name, binder.numSongs, binder.created]}
							key={binder.id}
							onClick={() => handleOpenBinder(binder.id)}
						/>
					))}
				</tbody>
			</table>
		</>
	);
}
