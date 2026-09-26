import Button from './Button';
import EditableData from './inputs/EditableData';
import { Link } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';
import UserApi from '../api/UserApi';
import useDebouncedCallback from '../hooks/useDebouncedCallback';
import { reportError } from '../utils/error';
import { useSelector } from 'react-redux';
import { selectCurrentMember } from '../store/authSlice';
import { REMOVE_MEMBERS } from '../utils/constants';
import Icon from './Icon';
import type { User } from '../types';

type MemberCardProps = {
  /** A team member, with their `position` on the team. */
  member: User;
  isCurrentUser: boolean;
  onPositionChanged: (newPosition: string) => void;
  onShowMemberMenu: () => void;
};

export default function MemberCard({
  member,
  isCurrentUser,
  onPositionChanged,
  onShowMemberMenu,
}: MemberCardProps) {
  // Non-null: MembersIndexPage renders inside Content, which renders nothing
  // until the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;

  // The id is passed in, so a waiting save goes to the member it was typed for.
  const debounce = useDebouncedCallback(
    (memberId: User['id'], newPosition: string) => {
      try {
        UserApi.updateMembership(memberId, { position: newPosition });
      } catch (error) {
        reportError(error);
      }
    },
    1000,
    'flush'
  );

  const handlePositionChange = (newPosition: string) => {
    onPositionChanged(newPosition);
    debounce(member.id, newPosition);
  };

  if (member) {
    let currentUserBubble;
    if (isCurrentUser) {
      currentUserBubble = (
        <span className="rounded-full px-3 py-0.5 bg-purple-600 text-white text-xs mb-1 inline">
          Me
        </span>
      );
    }

    let teamPosition = null;
    if (isCurrentUser) {
      teamPosition = (
        <EditableData
          value={member.position || ''}
          placeholder="What's your position on the team?"
          centered
          onChange={handlePositionChange}
        />
      );
    } else {
      teamPosition = <div className="text-sm">{member.position}</div>;
    }
    return (
      <div className="relative z-10 flex flex-col px-5 py-3 text-center rounded-md bg-gray-50 dark:bg-dark-gray-800">
        {currentMember.can(REMOVE_MEMBERS) && (
          <Button
            variant="icon"
            size="md"
            className="absolute right-2 top-2"
            onClick={onShowMemberMenu}
          >
            <Icon name="more_vert" className="h-5 text-gray-600" />
          </Button>
        )}
        <div className="w-20 h-20 m-auto flex-center">
          <ProfilePicture url={member.image_url} />
        </div>
        <div>{currentUserBubble}</div>
        <div className="overflow-hidden font-semibold text-ellipsis">
          {member.first_name
            ? member.first_name + ' ' + member.last_name
            : member.email}
        </div>
        {teamPosition}
        <div className="grow"></div>
        <Link to={`/members/${member.id}`}>
          <Button variant="accent" size="xs" full className="mt-2">
            View profile
          </Button>
        </Link>
      </div>
    );
  } else {
    return null;
  }
}
