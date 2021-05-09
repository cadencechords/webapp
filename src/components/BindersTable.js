import { useHistory } from "react-router";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import BinderColor from "./BinderColor";

export default function BindersTable({ binders }) {
	const router = useHistory();

	const handleOpenBinder = (binderId) => {
		router.push(`/app/binders/${binderId}`);
	};

	let binderOptions = binders.map((binder) => ({
		...binder,
		name: (
			<div className="flex items-center">
				<BinderColor color={binder.color} />
				<span className="ml-3">{binder.name}</span>
			</div>
		),
		numSongs: binder.songs ? binder.songs.length : 0,
	}));
	return (
		<>
			<table className="w-full">
				<TableHead columns={["NAME", "NUMBER OF SONGS", "CREATED"]} editable />
				<tbody>
					{binderOptions?.map((binder) => (
						<TableRow
							columns={[binder.name, binder.numSongs, new Date(binder.created_at).toDateString()]}
							key={binder.id}
							onClick={() => handleOpenBinder(binder.id)}
						/>
					))}
				</tbody>
			</table>
		</>
	);
}
