import InformationCircleIcon from '@heroicons/react/outline/InformationCircleIcon';
import { Link } from 'react-router-dom';
import MobileMenuButton from './buttons/MobileMenuButton';
import ProfilePicture from './ProfilePicture';
import StyledPopover from './StyledPopover';
import SwitchHorizontalIcon from '@heroicons/react/outline/SwitchHorizontalIcon';

export default function TeamOptionsPopover({ team }) {
  let button = (
    <div className="flex items-center w-full h-16 px-3 py-2 text-base font-semibold transition-colors dark:hover:bg-dark-gray-700 hover:bg-gray-200">
      <span className="w-8 mr-3">
        <ProfilePicture url={team.image_url} size="xs" />
      </span>
      <span className="hidden lg:inline dark:text-dark-gray-100">
        {team.name}
      </span>
    </div>
  );
  return (
    <StyledPopover button={button} position="bottom-start">
      <div className="overflow-hidden rounded-lg w-60">
        <Link
          className="block border-b dark:border-dark-gray-400 last:border-0"
          to="/team"
        >
          <MobileMenuButton full className="flex-between">
            View details
            <InformationCircleIcon className="w-4 h-4" />
          </MobileMenuButton>
        </Link>
        <Link
          className="block border-b dark:border-dark-gray-400 last:border-0"
          to="/login/teams"
        >
          <MobileMenuButton full className="flex-between">
            Switch teams
            <SwitchHorizontalIcon className="w-4 h-4" />
          </MobileMenuButton>
        </Link>
      </div>
    </StyledPopover>
  );
}
