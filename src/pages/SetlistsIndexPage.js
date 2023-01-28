import { useCallback, useEffect, useMemo, useState } from 'react';

import { ADD_SETLISTS } from '../utils/constants';
import CreateSetlistDialog from '../components/CreateSetlistDialog';
import NoDataMessage from '../components/NoDataMessage';
import QuickAdd from '../components/QuickAdd';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { isPast, sortDates } from '../utils/date';
import useSetlists from '../hooks/api/useSetlists';
import PageHeader from '../components/PageHeader';
import PageLoading from '../components/PageLoading';
import Alert from '../components/Alert';
import useDialog from '../hooks/useDialog';
import List from '../components/List';
import SetlistRow from '../components/SetlistRow';
import WellInput from '../components/inputs/WellInput';
import FadeIn from '../components/FadeIn';
import SetlistsTabs from '../components/SetlistsTabs';

export default function SetlistsIndexPage() {
  useEffect(() => (document.title = 'Sets'));
  const { data: setlists, isLoading, isError, isSuccess } = useSetlists();
  const [selectedTab, setSelectedTab] = useState('upcoming');

  const [query, setQuery] = useState('');

  const sortSetlists = useCallback(() => {
    let upcoming = [];
    let past = [];

    if (setlists?.length) {
      setlists.forEach(set =>
        isPast(set.scheduled_date) ? past.push(set) : upcoming.push(set)
      );

      upcoming.sort((setA, setB) =>
        sortDates(setA.scheduled_date, setB.scheduled_date)
      );

      past.sort((setA, setB) =>
        sortDates(setB.scheduled_date, setA.scheduled_date)
      );
    }

    return { upcomingSetlists: upcoming, pastSetlists: past };
  }, [setlists]);
  const { pastSetlists, upcomingSetlists } = useMemo(sortSetlists, [
    sortSetlists,
  ]);

  const [isCreateOpen, showCreateDialog, hideCreateDialog] = useDialog();
  const currentMember = useSelector(selectCurrentMember);

  function searchSetlists() {
    const selectedTabSetlists =
      selectedTab === 'upcoming' ? upcomingSetlists : pastSetlists;
    if (query?.length > 1) {
      const lowercasedQuery = query.toLowerCase();
      return selectedTabSetlists.filter(setlist =>
        setlist.name?.toLowerCase().includes(lowercasedQuery)
      );
    }

    return selectedTabSetlists;
  }

  return (
    <div className="mb-10">
      <PageHeader title="Sets" headerRightVisible={false} />
      {isLoading && <PageLoading />}
      {isError && (
        <Alert color="red">There was an issue retrieving your sets.</Alert>
      )}

      {isSuccess && (
        <>
          <FadeIn>
            <div className="mb-2">{setlists.length} total</div>
            <WellInput
              placeholder="Search your sets"
              value={query}
              onChange={setQuery}
              className="mb-4 lg:text-sm"
            />
            <SetlistsTabs selectedTab={selectedTab} onChange={setSelectedTab} />
          </FadeIn>
          <FadeIn className="delay-100">
            <List
              ListEmpty={<NoDataMessage type="sets" />}
              data={searchSetlists()}
              renderItem={setlist => (
                <SetlistRow setlist={setlist} key={setlist.id} />
              )}
            />
          </FadeIn>
        </>
      )}

      {currentMember.can(ADD_SETLISTS) && (
        <>
          <CreateSetlistDialog
            open={isCreateOpen}
            onCloseDialog={hideCreateDialog}
          />
          <QuickAdd onAdd={showCreateDialog} />
        </>
      )}
    </div>
  );
}
