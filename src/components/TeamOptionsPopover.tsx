import { MenuItem, MenuList } from './Menu';
import ProfilePicture from './ProfilePicture';
import StyledPopover from './StyledPopover';
import Icon from './Icon';
import type { Team } from '../types';

type TeamOptionsPopoverProps = {
  team: Team;
};

export default function TeamOptionsPopover({ team }: TeamOptionsPopoverProps) {
  const button = (
    <div className="flex items-center w-full h-16 px-3 py-2 text-base font-semibold transition-colors dark:hover:bg-dark-gray-700 hover:bg-gray-200">
      <span className="w-8 mr-3">
        <ProfilePicture url={team.image_url} name={team.name} size="xs" />
      </span>
      <span className="hidden lg:inline dark:text-dark-gray-100">
        {team.name}
      </span>
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
