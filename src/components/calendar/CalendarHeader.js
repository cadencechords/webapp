import Button from '../Button';
import ChevronLeftIcon from '@heroicons/react/outline/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/outline/ChevronRightIcon';
import PlusIcon from '@heroicons/react/outline/PlusIcon';
import { Link } from 'react-router-dom';

export default function CalendarHeader({
  title,
  onNextMonth,
  onPreviousMonth,
  canCreate,
}) {
  return (
    <>
      <div className="mb-4 flex-between">
        <div className="flex-1 gap-2 mr-2 flex-center">
          <h1 className="flex-grow text-2xl font-semibold">{title}</h1>
          <Button
            variant="icon"
            size="md"
            color="gray"
            onClick={onPreviousMonth}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Button>
          <Button variant="icon" size="md" color="gray" onClick={onNextMonth}>
            <ChevronRightIcon className="w-5 h-5" />
          </Button>
        </div>
        {canCreate && (
          <Link to="/calendar/new">
            <Button className="whitespace-nowrap">
              <div className="flex-center">
                <PlusIcon className="w-4 h-4 mr-1" />
                New event
              </div>
            </Button>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-7 mb-2 text-center text-gray-600 dark:text-dark-gray-200">
        <div className="col-span-1">Su</div>
        <div className="col-span-1">Mo</div>
        <div className="col-span-1">Tu</div>
        <div className="col-span-1">We</div>
        <div className="col-span-1">Th</div>
        <div className="col-span-1">Fr</div>
        <div className="col-span-1">Sa</div>
      </div>
    </>
  );
}
