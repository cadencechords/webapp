import { Link, useHistory } from "react-router-dom";
import TeamLoginOption from "./TeamLoginOption";
import { useDispatch } from "react-redux";
import { setTeamId } from "../store/authSlice";
import Button from "./Button";

export default function TeamLoginOptions({ teams }) {
	const router = useHistory();
	const dispatch = useDispatch();

	const handleLoginTeam = (teamId) => {
		localStorage.setItem("teamId", teamId);
		dispatch(setTeamId(teamId));
		router.push("/app");
	};

	return (
		<>
			<div className="font-semibold text-xl mb-6">Choose a team to login to</div>
			<div>
				{teams.map((team) => (
					<TeamLoginOption team={team} key={team.id} onLoginTeam={handleLoginTeam} />
				))}
			</div>
			<div className="mt-6 flex flex-col">
				<span className="mb-4">Or create a new team</span>
				<Link to="/login/teams/new">
					<Button variant="open" full>
						Create
					</Button>
				</Link>
			</div>
		</>
	);
}

TeamLoginOptions.defaultProps = {
	teams: [],
};
