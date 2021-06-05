import Button from "./Button";

export default function TeamLoginOption({ team, onLoginTeam }) {
	return (
		<div className="flex p-3 justify-between items-center m-2 border-b last:border-0">
			{team.name}
			<Button color="blue" onClick={() => onLoginTeam(team.id)}>
				Login
			</Button>
		</div>
	);
}
