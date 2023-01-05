import { Tab } from '@headlessui/react';
import React from 'react';
import EventFormDetailsPanel from './EventFormDetailsPanel';
import EventFormRemindersPanel from './EventFormRemindersPanel';
import EventFormSetlistPanel from './EventFormSetlistPanel';
import useSetlists from '../hooks/api/useSetlists';
import useTeamMembers from '../hooks/api/useTeamMembers';

export default function EventForm() {
  useSetlists();
  useTeamMembers();

  return (
    <div>
      <Tab.Group as="div" className="col-span-4 pt-4 mb-10 lg:col-span-3">
        <Tab.List>
          <Tab className="outline-none focus:outline-none">
            {({ selected }) => (
              <div
                className={`${
                  selected ? SELECTED_TAB_CLASSES : ''
                } ${TAB_CLASSES}`}
              >
                Details
              </div>
            )}
          </Tab>
          <Tab className="outline-none focus:outline-none">
            {({ selected }) => (
              <div
                className={`${
                  selected ? SELECTED_TAB_CLASSES : ''
                } ${TAB_CLASSES}`}
              >
                Reminders
              </div>
            )}
          </Tab>
          <Tab className="outline-none focus:outline-none">
            {({ selected }) => (
              <div
                className={`${
                  selected ? SELECTED_TAB_CLASSES : ''
                } ${TAB_CLASSES}`}
              >
                Set
              </div>
            )}
          </Tab>
        </Tab.List>
        <Tab.Panels as="div" className="mt-6 outline-none focus:outline-none">
          <Tab.Panel as="div" className="outline-none focus:outline-none">
            <EventFormDetailsPanel />
          </Tab.Panel>
          <Tab.Panel as="div" className="outline-none focus:outline-none">
            <EventFormRemindersPanel />
          </Tab.Panel>
          <Tab.Panel as="div" className="outline-none focus:outline-none">
            <EventFormSetlistPanel />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

const TAB_CLASSES =
  'px-4 py-1 font-medium hover:bg-gray-100 dark:hover:bg-dark-gray-800 transition-colors text-sm';
const SELECTED_TAB_CLASSES =
  'border-b-2 border-blue-600 dark:border-dark-blue text-blue-700';
