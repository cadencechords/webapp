import { useCallback, useMemo, useState } from 'react';

import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import NoDataMessage from '../components/NoDataMessage';
import ProfilePicture from '../components/ProfilePicture';
import SearchField from '../components/inputs/SearchField';
import { getNameOrEmail, hasName } from '../utils/model';
import useTeamMembers from '../hooks/api/useTeamMembers';
import {
  LIST_ITEM_INTERACTIVE,
  LIST_ITEM_TWO_LINE,
  LIST_SUPPORTING_TEXT,
} from './lists/listItem';
import type { EventMembership, Membership } from '../types';

type EventMembersProps = {
  /** The members checked so far. */
  members: EventMembership[];
  onChange: (members: EventMembership[]) => void;
};

// Who gets the event's reminder: the team's members as two-line items (a
// picture, their name and email) with a trailing checkbox, in a segmented
// list that scrolls, under a search bar and select all / clear.
export default function EventMembers({ members, onChange }: EventMembersProps) {
  const { data: teamMembers, isLoading } = useTeamMembers();
  const [query, setQuery] = useState('');

  const filterMembers = useCallback(() => {
    if (!query) return teamMembers;

    return teamMembers?.filter(teamMember => {
      if (hasName(teamMember.user)) {
        if (
          // Non-null: hasName checked first_name.
          teamMember.user.first_name!.toLowerCase().includes(query) ||
          // Non-null: assumed, as before, for a user with a first name. One
          // without a last name throws here.
          teamMember.user.last_name!.toLowerCase().includes(query)
        ) {
          return true;
        }
      }
      if (teamMember.user.email.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    });
  }, [query, teamMembers]);
  const queriedMembers = useMemo(() => filterMembers(), [filterMembers]);

  function isMemberChecked(member: EventMembership) {
    return !!members?.find(
      alreadyCheckedMember => alreadyCheckedMember.id === member.id
    );
  }

  function handleToggleMember(checked: boolean, member: Membership) {
    if (checked) {
      onChange(members.concat(member));
    } else {
      onChange(
        members.filter(
          alreadySelectedMember => alreadySelectedMember.id !== member.id
        )
      );
    }
  }

  const checkedCount = members?.length ?? 0;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 font-plain text-title-medium text-on-surface">
          Members
          <span className="ml-2 text-body-medium text-on-surface-variant">
            {checkedCount} selected
          </span>
        </div>
        <Button variant="open" size="sm" onClick={() => onChange(teamMembers)}>
          Select all
        </Button>
        <Button
          variant="open"
          size="sm"
          disabled={checkedCount === 0}
          onClick={() => onChange([])}
        >
          Clear
        </Button>
      </div>
      <SearchField onChange={setQuery} value={query} className="mb-3" />
      {isLoading || queriedMembers.length === 0 ? (
        <NoDataMessage compact loading={isLoading} type="members" />
      ) : (
        <div className="list-segmented">
          {queriedMembers.map(member => (
            // A label, so a click anywhere on the row toggles the checkbox.
            <label
              key={member.id}
              className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE} cursor-pointer`}
            >
              <ProfilePicture
                url={member.user.image_url}
                name={getNameOrEmail(member.user)}
                size="md"
              />
              <span className="flex-1 min-w-0">
                <span className="block truncate">
                  {hasName(member.user)
                    ? `${member.user.first_name} ${member.user.last_name}`
                    : member.user.email}
                </span>
                {hasName(member.user) && (
                  <span className={`block truncate ${LIST_SUPPORTING_TEXT}`}>
                    {member.user.email}
                  </span>
                )}
              </span>
              <Checkbox
                onChange={newValue => handleToggleMember(newValue, member)}
                checked={isMemberChecked(member)}
                standAlone={false}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
