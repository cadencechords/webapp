import { useEffect, useState } from "react";

import CenteredPage from "../components/CenteredPage";
import NoTeamYet from "../components/NoTeamYet";
import PulseLoader from "react-spinners/PulseLoader";
import TeamApi from "../api/TeamApi";
import TeamLoginOptions from "../components/TeamLoginOptions";
import { reportError } from "../utils/error";

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
				reportError(error);
			} finally {
				setLoading(false);
			}
		}

		fetchTeams();
	}, []);

	return (
		<CenteredPage>
			<div className="text-center">
				{loading && <PulseLoader color="#1f6feb" />}
				{!loading && teams.length === 0 && <NoTeamYet />}
				{!loading && teams.length > 0 && <TeamLoginOptions teams={teams} />}
			</div>
		</CenteredPage>
	);
}
