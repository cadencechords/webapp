import Button from './Button';
import DotsVerticalIcon from '@heroicons/react/outline/DotsVerticalIcon';
import EditableData from './inputs/EditableData';
import { Link } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';
import UserApi from '../api/UserApi';
import _ from 'lodash';
import { reportError } from '../utils/error';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentMember } from '../store/authSlice';
import { REMOVE_MEMBERS } from '../utils/constants';

export default function MemberCard({
  member,
  isCurrentUser,
  onPositionChanged,
  onShowMemberMenu,
}) {
  const currentMember = useSelector(selectCurrentMember);

  const handlePositionChange = newPosition => {
    onPositionChanged(newPosition);
    debounce(newPosition);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = useCallback(
    _.debounce(newPosition => {
      try {
        UserApi.updateMembership(member.id, { position: newPosition });
      } catch (error) {
        reportError(error);
      }
    }, 1000),
    []
  );

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
            <DotsVerticalIcon className="h-5 text-gray-600" />
          </Button>
        )}
        <div className="w-20 h-20 m-auto flex-center">
          <ProfilePicture url={member.image_url} />
        </div>
        <div>{currentUserBubble}</div>
        <div className="font-semibold">
          {member.first_name
            ? member.first_name + ' ' + member.last_name
            : member.email}
        </div>
        {teamPosition}
        <div className="flex-grow"></div>
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
