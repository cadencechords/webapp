import { useCallback, useMemo, useState } from 'react';

import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import PageLoading from '../components/PageLoading';
import WellInput from '../components/inputs/WellInput';
import { hasName } from '../utils/model';
import useTeamMembers from '../hooks/api/useTeamMembers';
import type { EventMembership, Membership } from '../types';

type EventMembersProps = {
  /** The members checked so far. */
  members: EventMembership[];
  onChange: (members: EventMembership[]) => void;
};

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

  if (isLoading) return <PageLoading />;

  return (
    <div>
      <div className="mb-3 font-semibold">Members</div>
      <WellInput onChange={setQuery} value={query} />
      <div className="my-4">
        <Button
          variant="open"
          size="xs"
          className="mr-2"
          onClick={() => onChange(teamMembers)}
        >
          Check all
        </Button>
        <Button variant="open" size="xs" onClick={() => onChange([])}>
          Uncheck all
        </Button>
        {queriedMembers.map(member => (
          <div
            key={member.id}
            className="flex items-center gap-4 p-2 border-b cursor-pointer last:border-0 dark:border-dark-gray-400"
            onClick={() => handleToggleMember(!isMemberChecked(member), member)}
          >
            <Checkbox
              onChange={newValue => handleToggleMember(newValue, member)}
              checked={isMemberChecked(member)}
            />
            <div>
              {hasName(member.user) ? (
                <>
                  {member.user.first_name} {member.user.last_name}
                </>
              ) : (
                member.user.email
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
