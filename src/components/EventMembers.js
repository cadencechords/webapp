import { useCallback, useMemo, useState } from 'react';

import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import PageLoading from '../components/PageLoading';
import WellInput from '../components/inputs/WellInput';
import { hasName } from '../utils/model';
import useTeamMembers from '../hooks/api/useTeamMembers';

export default function EventMembers({ members, onChange }) {
  const { data: teamMembers, isLoading } = useTeamMembers();
  const [query, setQuery] = useState('');

  const filterMembers = useCallback(() => {
    if (!query) return teamMembers;

    return teamMembers?.filter(teamMember => {
      if (hasName(teamMember.user)) {
        if (
          teamMember.user.first_name.toLowerCase().includes(query) ||
          teamMember.user.last_name.toLowerCase().includes(query)
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

  function isMemberChecked(member) {
    return !!members?.find(
      alreadyCheckedMember => alreadyCheckedMember.id === member.id
    );
  }

  function handleToggleMember(checked, member) {
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
