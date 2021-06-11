import Button from "./Button";
import ProfilePicture from "./ProfilePicture";

export default function TeamLoginOption({ team, onLoginTeam }) {
	return (
		<div className="flex p-3 justify-between items-center m-2 border-b last:border-0">
			<div className="flex items-center">
				<ProfilePicture url={team.image_url} size="sm" />
				<span className="ml-4">{team.name}</span>
			</div>
			<Button color="blue" onClick={() => onLoginTeam(team.id)}>
				Login
			</Button>
		</div>
	);
}
