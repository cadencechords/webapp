import Button from './Button';
import CalendarIcon from '@heroicons/react/outline/CalendarIcon';
import { Link } from 'react-router-dom';
import MusicNoteIcon from '@heroicons/react/solid/MusicNoteIcon';
import NoDataMessage from './NoDataMessage';
import SectionTitle from './SectionTitle';
import { format } from '../utils/DateUtils';

export default function DashboardTodaysSetlists({ setlists }) {
  function buildSetlists() {
    return setlists?.map(setlist => (
      <div
        className="border-b dark:border-dark-gray-600 last:border-0 py-2.5 px-2 flex-between"
        key={setlist.id}
      >
        <div>
          <div className="mb-2 font-semibold">{setlist.name}</div>
          <div className="flex items-center text-sm text-gray-600 dark:text-dark-gray-200">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {format('ddd MMM D', setlist?.scheduled_date)}
            </div>
            <div className="flex items-center ml-5">
              <MusicNoteIcon className="w-4 h-4 mr-2" />
              {setlist.scheduled_songs?.length}
            </div>
          </div>
        </div>
        <div className="gap-4 flex-center">
          <Link to={`/sets/${setlist.id}/present`}>
            <Button
              className="flex-center"
              size="xs"
              variant="filled"
              color="blue"
            >
              Present
            </Button>
          </Link>
          <Link to={`/sets/${setlist.id}`}>
            <Button size="xs" variant="accent">
              Details
            </Button>
          </Link>
        </div>
      </div>
    ));
  }

  return (
    <div>
      <SectionTitle title="Today's sets" />

      {setlists?.length > 0 ? (
        buildSetlists()
      ) : (
        <NoDataMessage>No sets are scheduled for today</NoDataMessage>
      )}
    </div>
  );
}
