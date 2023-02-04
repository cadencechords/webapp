import { DELETE_EVENTS, EDIT_EVENTS } from '../utils/constants';

import BellIcon from '@heroicons/react/solid/BellIcon';
import Button from '../components/Button';
import MenuAlt2Icon from '@heroicons/react/solid/MenuAlt2Icon';
import PencilIcon from '@heroicons/react/outline/PencilIcon';
import TrashIcon from '@heroicons/react/outline/TrashIcon';
import UsersIcon from '@heroicons/react/solid/UsersIcon';
import eventsApi from '../api/eventsApi';
import { format } from '../utils/date';
import { hasName } from '../utils/model';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useEventForm from '../hooks/forms/useEventForm';

export default function EventDetailSheet({ event, onDeleted, onCloseDialog }) {
  const currentMember = useSelector(selectCurrentMember);
  const { setForm } = useEventForm();

  function handleDelete() {
    eventsApi.delete(event.id);
    onDeleted(event.id);
    onCloseDialog();
  }

  function handleEdit() {
    setForm(event);
  }

  if (event)
    return (
      <>
        <div className="grid grid-cols-10 gap-6">
          <div className="flex items-start justify-end col-span-1">
            <UsersIcon className="flex-shrink-0 w-5 h-5 my-1 text-gray-600 dark:text-dark-gray-200" />
          </div>
          <div className="flex flex-col items-start justify-start col-span-9">
            {event?.memberships?.length > 0 ? (
              event.memberships.map(member => (
                <div key={member.id} className="my-1">
                  {hasName(member.user)
                    ? `${member.user.first_name} ${member.user.last_name}`
                    : member.user.email}
                </div>
              ))
            ) : (
              <div className="text-gray-600 dark:text-dark-gray-200">
                No members
              </div>
            )}
          </div>
          <div className="flex items-start justify-end col-span-1">
            <BellIcon className="flex-shrink-0 w-5 h-5 text-gray-600 dark:text-dark-gray-200" />
          </div>
          <div className="flex items-start justify-start col-span-9">
            {event.reminders_enabled ? (
              `Reminders will be sent ${format(
                event.reminder_date,
                'MMMM D, YYYY h:mma'
              )}`
            ) : (
              <div className="text-gray-600 dark:text-dark-gray-200">
                Reminders are not enabled for this event
              </div>
            )}
          </div>

          <div className="flex items-start justify-end col-span-1">
            <MenuAlt2Icon className="flex-shrink-0 w-5 h-5 text-gray-600 dark:text-dark-gray-200" />
          </div>
          <div className="flex items-start justify-start col-span-9">
            {event.description ? (
              event.description
            ) : (
              <div className="text-gray-600 dark:text-dark-gray-200">
                No description provided for this event
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          {currentMember?.can(EDIT_EVENTS) && (
            <Link to={`/calendar/${event.id}/edit`} onClick={handleEdit}>
              <Button variant="icon" color="gray" size="md" className="mr-4">
                <PencilIcon className="w-6 h-6" />
              </Button>
            </Link>
          )}
          {currentMember?.can(DELETE_EVENTS) && (
            <Button
              variant="icon"
              color="gray"
              size="md"
              onClick={handleDelete}
            >
              <TrashIcon className="w-6 h-6" />
            </Button>
          )}
        </div>
      </>
    );

  return null;
}
