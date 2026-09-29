import ProfilePicture from './ProfilePicture';
import Icon from './Icon';
import type { Team } from '../types';
import { LIST_ITEM_INTERACTIVE } from './lists/listItem';

type TeamLoginOptionProps = {
  team: Team;
  onLoginTeam: (teamId: number) => void;
};

/** A row on the team login page: like a list item, but rounder and roomier
    than list-segmented's default segments. */
export const TEAM_ROW =
  'flex items-center gap-4 px-5 py-3 rounded-medium first:rounded-t-extra-large last:rounded-b-extra-large font-plain text-body-large text-on-surface';

// A segment of the team list, styled like the account page's rows: the
// team's picture, its name, and a chevron.
export default function TeamLoginOption({
  team,
  onLoginTeam,
}: TeamLoginOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onLoginTeam(team.id)}
      className={`${TEAM_ROW} ${LIST_ITEM_INTERACTIVE} min-h-16 w-full text-left`}
    >
      <ProfilePicture url={team.image_url} name={team.name} size="md" />
      <span className="flex-1 min-w-0 truncate text-title-medium">
        {team.name}
      </span>
      <Icon
        name="chevron_right"
        className="w-6 h-6 shrink-0 text-on-surface-variant"
      />
    </button>
  );
}
