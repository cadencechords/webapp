import { useEffect, useState } from "react";

import Button from "../components/Button";
import CenteredPage from "../components/CenteredPage";
import OutlinedInput from "../components/inputs/OutlinedInput";
import TeamApi from "../api/TeamApi";
import TeamPlanOption from "../components/TeamPlanOption";
import { reportError } from "../utils/error";
import { setTeamId } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import useQuery from "../hooks/useQuery";

export default function CreateNewTeamPage() {
	const [teamName, setTeamIdName] = useState("");
	const [selectedPlan, setSelectedPlan] = useState("Starter");
	const [loading, setLoading] = useState(false);
	const router = useHistory();
	const dispatch = useDispatch();
	const requestedPlan = useQuery().get("requested_plan");

	useEffect(() => {
		if (requestedPlan && (requestedPlan === "Starter" || requestedPlan === "Pro")) {
			setSelectedPlan(requestedPlan);
		} else {
			setSelectedPlan("Starter");
		}
	}, [requestedPlan]);

	const handleCreate = async () => {
		setLoading(!loading);

		try {
			let newTeam = { name: teamName, plan: selectedPlan };
			let { data } = await TeamApi.createOne(newTeam);
			dispatch(setTeamId(data.id));
			router.push("/");
		} catch (error) {
			reportError(error);
			setLoading(false);
		}
	};

	return (
		<CenteredPage>
			<div className="font-bold text-xl mb-6 text-center">Your New Team</div>
			<TeamPlanOption
				name="Starter"
				onClick={setSelectedPlan}
				selected={"Starter" === selectedPlan}
				className="mb-2"
				pricing="$0.00"
				trialMessage="Always free"
			/>
			<TeamPlanOption
				name="Pro"
				onClick={setSelectedPlan}
				selected={"Pro" === selectedPlan}
				className="mb-8"
				pricing={
					<div>
						$10.00<span className="text-sm"> / month</span>
					</div>
				}
				trialMessage="30 Day Free Trial"
			/>
			<div className="mb-1 font-semibold text-left">Your team's name</div>
			<OutlinedInput
				placeholder="Name"
				value={teamName}
				onChange={(editedTeamName) => setTeamIdName(editedTeamName)}
			/>

			<div className="mt-6">
				<Button full loading={loading} onClick={handleCreate}>
					Create
				</Button>
			</div>
		</CenteredPage>
	);
}
