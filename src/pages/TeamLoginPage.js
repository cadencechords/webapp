import { useEffect, useState } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import TeamApi from "../api/TeamApi";
import CenteredPage from "../components/CenteredPage";
import NoTeamYet from "../components/NoTeamYet";
import TeamLoginOptions from "../components/TeamLoginOptions";

export default function TeamLoginPage() {
	const [teams, setTeamIds] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		document.title = "Login | Teams";

		async function fetchTeams() {
			try {
				let result = await TeamApi.getAll();
				setTeamIds(result.data);
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		}

		fetchTeams();
	}, []);

	return (
		<CenteredPage>
			<div className="text-center">
				{loading && <PulseLoader color="blue" />}
				{!loading && teams.length === 0 && <NoTeamYet />}
				{!loading && teams.length > 0 && <TeamLoginOptions teams={teams} />}
			</div>
		</CenteredPage>
	);
}
