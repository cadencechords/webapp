import MobileMenuButton from "./buttons/MobileMenuButton";
import ProfilePicture from "./ProfilePicture";

export default function TeamLoginOption({ team, onLoginTeam }) {
	return (
		<MobileMenuButton
			className="flex-between p-3 border-b last:border-0"
			onClick={() => onLoginTeam(team.id)}
			full
		>
			<div className="flex items-center">
				<ProfilePicture url={team.image_url} size="sm" />
				<span className="ml-4">{team.name}</span>
			</div>
		</MobileMenuButton>
	);
}
