import { Link, useHistory } from "react-router-dom";
import OpenButton from "./buttons/OpenButton";
import TeamLoginOption from "./TeamLoginOption";

export default function TeamLoginOptions({ teams }) {
	const router = useHistory();

	const handleLoginTeam = (teamId) => {
		localStorage.setItem("teamId", teamId);
		router.push("/app");
	};

	return (
		<>
			<div className="font-semibold text-xl mb-6">Choose a team to login to</div>

			{teams.map((team) => (
				<TeamLoginOption team={team} key={team.id} onLoginTeam={handleLoginTeam} />
			))}

			<div className="mt-6 flex flex-col">
				<span className="mb-4">Or create a new team</span>
				<Link to="/login/teams/new">
					<OpenButton full bold color="blue">
						Create
					</OpenButton>
				</Link>
			</div>
		</>
	);
}

TeamLoginOptions.defaultProps = {
	teams: [],
};
