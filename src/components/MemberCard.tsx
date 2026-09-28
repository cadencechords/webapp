import Button, { buttonClasses } from './Button';
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
import { getNameOrEmail } from '../utils/model';

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

  if (!member) return null;

  const name = member.first_name
    ? `${member.first_name} ${member.last_name}`
    : member.email;

  // An M3E profile card: a large avatar, the name and position centered,
  // and a tonal "View profile" button along the bottom.
  return (
    <div className="relative flex flex-col items-center gap-1 p-6 pt-8 text-center rounded-extra-large bg-surface-container-low text-on-surface font-plain">
      {currentMember.can(REMOVE_MEMBERS) && (
        <Button
          variant="icon"
          color="gray"
          size="md"
          name={`Options for ${name}`}
          className="absolute right-2 top-2"
          onClick={onShowMemberMenu}
        >
          <Icon name="more_vert" className="w-6 h-6" />
        </Button>
      )}
      <div className="mb-3">
        <ProfilePicture
          url={member.image_url}
          name={getNameOrEmail(member)}
          size="lg"
        />
      </div>
      <div className="flex items-center justify-center w-full min-w-0 gap-2">
        <span className="truncate text-title-large">{name}</span>
        {isCurrentUser && (
          <span className="shrink-0 px-2 h-6 leading-6 rounded-full bg-tertiary-container text-on-tertiary-container text-label-medium">
            Me
          </span>
        )}
      </div>
      {isCurrentUser ? (
        <EditableData
          value={member.position || ''}
          placeholder="What's your position on the team?"
          centered
          onChange={handlePositionChange}
        />
      ) : (
        member.position && (
          <div className="text-body-medium text-on-surface-variant">
            {member.position}
          </div>
        )
      )}
      <div className="grow" />
      <Link
        to={`/members/${member.id}`}
        className={buttonClasses({
          variant: 'accent',
          color: 'gray',
          size: 'sm',
          full: true,
          className: 'flex-center mt-4',
        })}
      >
        View profile
      </Link>
    </div>
  );
}
