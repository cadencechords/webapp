import BindersList from "./BindersList";
import { Route } from "react-router-dom";
import SongsList from "./SongsList";
import SetsList from "./SetsList";
import BinderDetail from "./BinderDetail";
import SongDetail from "./SongDetail";
import AccountDetail from "./AccountDetail";
import PersonalDetails from "./PersonalDetails";
import UserApi from "../api/UserApi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../store/authSlice";
import MembersList from "./MembersList";

export default function Content() {
	const dispatch = useDispatch();
	useEffect(() => {
		async function fetchCurrentUser() {
			try {
				let { data } = await UserApi.getCurrentUser();
				dispatch(setCurrentUser(data));
			} catch (error) {
				console.log(error);
			}
		}

		fetchCurrentUser();
	});
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
				<Route path="/app/account/personal" exact>
					<PersonalDetails />
				</Route>
				<Route path="/app/account" exact>
					<AccountDetail />
				</Route>
				<Route path="/app/members" exact>
					<MembersList />
				</Route>
			</div>
		</div>
	);
}
