import { useHistory } from "react-router";
import TableHead from "./TableHead";
import TableRow from "./TableRow";
import BinderColor from "./BinderColor";

export default function BindersTable({ binders }) {
	const router = useHistory();

	const handleOpenBinder = (binderId) => {
		router.push(`/binders/${binderId}`);
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
			<div className="hidden sm:block">
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
			</div>
			<div className="sm:hidden">
				{binders.map((binder) => (
					<div
						key={binder.id}
						className="border-b py-2.5 flex items-center px-2 last:border-0 cursor-pointer bg-white transition-colors hover:bg-gray-50 focus:bg-gray-50"
						onClick={() => router.push(`/binders/${binder.id}`)}
					>
						<BinderColor color={binder.color} />
						<div className="ml-3">
							<div className="font-semibold">{binder.name}</div>
							<div className="text-sm text-gray-600">{binder.description}</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
}
