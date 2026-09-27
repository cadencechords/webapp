import { MenuItem, MenuList } from './Menu';
import ProfilePicture from './ProfilePicture';
import StyledPopover from './StyledPopover';
import Icon from './Icon';
import type { Team } from '../types';

type TeamOptionsPopoverProps = {
  team: Team;
};

export default function TeamOptionsPopover({ team }: TeamOptionsPopoverProps) {
  // The rail's header: the team's picture in a 48dp circle (collapsed), or
  // picture and name in a 56dp pill (expanded).
  const button = (
    <div className="flex items-center h-16 px-6 lg:px-3">
      <div className="flex items-center justify-center w-12 h-12 rounded-full state-layer text-on-surface lg:justify-start lg:w-full lg:h-14 lg:gap-3 lg:px-3">
        <ProfilePicture url={team.image_url} name={team.name} size="xs" />
        <span className="hidden truncate lg:inline font-plain text-title-small">
          {team.name}
        </span>
      </div>
    </div>
  );
  return (
    <StyledPopover button={button} position="bottom-start">
      <MenuList className="w-60">
        <MenuItem to="/team" icon={<Icon name="info" />}>
          View details
        </MenuItem>
        <MenuItem to="/login/teams" icon={<Icon name="swap_horiz" />}>
          Switch teams
        </MenuItem>
      </MenuList>
    </StyledPopover>
  );
}
