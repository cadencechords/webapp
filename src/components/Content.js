import BindersList from "./BindersList";
import { Route } from "react-router-dom";
import SongsList from "./SongsList";
import SetsList from "./SetsList";
import BinderDetail from "./BinderDetail";
import SongDetail from "./SongDetail";

export default function Content() {
	return (
		<div className="md:ml-56 md:px-10 px-2 py-3">
			<div className="container mx-auto">
				<Route path="/app/binders/:id" exact>
					<BinderDetail />
				</Route>
				<Route path="/app/binders" exact>
					<BindersList />
				</Route>
				<Route path="/app/songs/:id" exact>
					<SongDetail />
				</Route>
				<Route path="/app/songs" exact>
					<SongsList />
				</Route>
				<Route path="/app/sets">
					<SetsList />
				</Route>
			</div>
		</div>
	);
}
