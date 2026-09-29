import classNames from 'classnames';
import { useMemo, useState } from 'react';
import useSetlists from '../hooks/api/useSetlists';
import { sortDates } from '../utils/date';
import { format } from '../utils/DateUtils';
import SearchField from './inputs/SearchField';
import NoDataMessage from './NoDataMessage';
import useEventForm from '../hooks/forms/useEventForm';
import {
  LIST_ITEM_INTERACTIVE,
  LIST_ITEM_TWO_LINE,
  LIST_SUPPORTING_TEXT,
} from './lists/listItem';
import type { Setlist } from '../types';

// The set an event is for: the team's sets, newest first, as a radio group
// of two-line items in a segmented list that scrolls. Picking the chosen set
// again clears it.
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

  function handleToggle(setlist: Setlist) {
    onChange('setlist', selectedSetlist?.id === setlist.id ? null : setlist);
  }

  return (
    <div>
      <SearchField
        onChange={setQuery}
        value={query}
        placeholder="Search your team's sets"
        className="mb-3"
      />
      {isLoading || queriedSetlists.length === 0 ? (
        <NoDataMessage compact loading={isLoading} type="sets" />
      ) : (
        <div role="radiogroup" aria-label="Set" className="list-segmented">
          {queriedSetlists.map(setlist => {
            const isPicked = selectedSetlist?.id === setlist.id;
            return (
              <button
                key={setlist.id}
                type="button"
                role="radio"
                aria-checked={isPicked}
                onClick={() => handleToggle(setlist)}
                className={classNames(
                  LIST_ITEM_TWO_LINE,
                  LIST_ITEM_INTERACTIVE,
                  'w-full text-left'
                )}
              >
                <RadioMark checked={isPicked} />
                <span className="min-w-0">
                  <span className="block truncate">{setlist.name}</span>
                  {setlist.scheduled_date && (
                    <span className={classNames('block', LIST_SUPPORTING_TEXT)}>
                      {format('ddd MMM D, YYYY', setlist.scheduled_date)}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// An M3 radio button's look (20dp ring, 10dp dot when checked); the row is
// the control.
function RadioMark({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={classNames(
        'flex-center w-5 h-5 shrink-0 rounded-full border-2 transition-fast-effects',
        checked ? 'border-primary' : 'border-on-surface-variant'
      )}
    >
      {checked && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
    </span>
  );
}
