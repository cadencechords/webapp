import { useState } from "react";
import { useHistory } from "react-router";
import OutlinedButton from "./buttons/OutlinedButton";

export default function NoTeamYet() {
	const router = useHistory();

	return (
		<>
			<div className="text-xl font-semibold mb-4">
				Looks like you aren't a part of any teams yet
			</div>
			<OutlinedButton full onClick={() => router.push("/login/teams/new")}>
				Make one now
			</OutlinedButton>
		</>
	);
}
