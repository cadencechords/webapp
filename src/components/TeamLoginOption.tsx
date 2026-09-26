import MobileMenuButton from './buttons/MobileMenuButton';
import ProfilePicture from './ProfilePicture';
import type { Team } from '../types';

type TeamLoginOptionProps = {
  team: Team;
  onLoginTeam: (teamId: number) => void;
};

export default function TeamLoginOption({
  team,
  onLoginTeam,
}: TeamLoginOptionProps) {
  return (
    <MobileMenuButton
      className="flex-between p-3 border-b last:border-0 dark:border-dark-gray-400"
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
