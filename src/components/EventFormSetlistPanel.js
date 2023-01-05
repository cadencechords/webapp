import React, { useMemo, useState } from 'react';
import useSetlists from '../hooks/api/useSetlists';
import PageLoading from './PageLoading';
import { sortDates } from '../utils/date';
import WellInput from './inputs/WellInput';
import Checkbox from './Checkbox';
import useEventForm from '../hooks/forms/useEventForm';

export default function EventFormSetlistPanel() {
  const { isLoading, data: setlists } = useSetlists();
  const [query, setQuery] = useState('');

  const { form, onChange } = useEventForm();
  const { setlist: selectedSetlist } = form;

  const sortedSetlists = useMemo(
    () =>
      setlists?.sort((setA, setB) =>
        sortDates(setB.scheduled_date, setA.scheduled_date)
      ) || [],
    [setlists]
  );

  const queriedSetlists = useMemo(() => {
    const lowercasedQuery = query.toLowerCase();
    return sortedSetlists.filter(set =>
      set.name.toLowerCase().includes(lowercasedQuery)
    );
  }, [query, sortedSetlists]);

  function handleToggle(checked, setlist) {
    if (checked) onChange('setlist', setlist);
    else {
      onChange('setlist', null);
    }
  }

  if (isLoading) return <PageLoading />;
  return (
    <div>
      <div className="mb-4 font-semibold">Your team's sets</div>
      <WellInput onChange={setQuery} value={query} className="mb-4" />

      {queriedSetlists.map(setlist => (
        <div
          key={setlist.id}
          onClick={() =>
            handleToggle(!(selectedSetlist?.id === setlist.id), setlist)
          }
          className="flex items-center gap-4 p-2 border-b cursor-pointer last:border-0 dark:border-dark-gray-400"
        >
          <Checkbox
            checked={selectedSetlist?.id === setlist.id}
            onChange={newValue => handleToggle(newValue, setlist)}
          />
          {setlist.name}
        </div>
      ))}
    </div>
  );
}
