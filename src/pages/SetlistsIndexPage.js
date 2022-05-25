import { useEffect, useState } from "react";

import { ADD_SETLISTS } from "../utils/constants";
import CreateSetlistDialog from "../components/CreateSetlistDialog";
import MobileHeaderAndBottomButton from "../components/MobileHeaderAndBottomButton";
import NoDataMessage from "../components/NoDataMessage";
import PageTitle from "../components/PageTitle";
import QuickAdd from "../components/QuickAdd";
import SetlistApi from "../api/SetlistApi";
import SetlistsList from "../components/SetlistsList";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";
import { isPast, sortDates } from "../utils/date";

export default function SetlistsIndexPage() {
  useEffect(() => (document.title = "Sets"));
  const [setlists, setSetlists] = useState([]);
  const [upcomingSetlists, setUpcomingSetlists] = useState([]);
  const [pastSetlists, setPastSetlists] = useState([]);
  const [showCreateSetlistDialog, setShowCreateSetlistDialog] = useState(false);
  const currentMember = useSelector(selectCurrentMember);

  useEffect(() => {
    let { data } = SetlistApi.getAll();
    setSetlists(data);
  }, []);

  useEffect(() => {
    let upcoming = [];
    let past = [];

    setlists?.forEach((set) =>
      isPast(set.scheduled_date) ? past.push(set) : upcoming.push(set)
    );

    setUpcomingSetlists(
      upcoming.sort((setA, setB) =>
        sortDates(setA.scheduled_date, setB.scheduled_date)
      )
    );
    setPastSetlists(
      past.sort((setA, setB) =>
        sortDates(setB.scheduled_date, setA.scheduled_date)
      )
    );
  }, [setlists]);

  const handleSetlistCreated = (newSetlist) => {
    setSetlists([...setlists, newSetlist]);
  };

  let content = null;

  if (setlists.length === 0) {
    content = (
      <NoDataMessage>
        You don't have any sets yet. Click the add button to get started.
      </NoDataMessage>
    );
  } else {
    content = (
      <SetlistsList
        upcomingSetlists={upcomingSetlists}
        pastSetlists={pastSetlists}
      />
    );
  }

  return (
    <>
      <div className="sm:hidden mt-14 mb-10">
        <MobileHeaderAndBottomButton
          buttonText="Add a set"
          onAdd={() => setShowCreateSetlistDialog(true)}
          pageTitle="Sets"
          canAdd={currentMember.can(ADD_SETLISTS)}
        />
      </div>
      <div className="hidden sm:block">
        <PageTitle title="Sets" />
      </div>

      {content}

      {currentMember.can(ADD_SETLISTS) && (
        <>
          <div className="hidden sm:block">
            <QuickAdd onAdd={() => setShowCreateSetlistDialog(true)} />
          </div>
          <CreateSetlistDialog
            open={showCreateSetlistDialog}
            onCloseDialog={() => setShowCreateSetlistDialog(false)}
            onCreated={handleSetlistCreated}
          />
        </>
      )}
    </>
  );
}
