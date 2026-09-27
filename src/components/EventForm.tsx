import { Tab } from '@headlessui/react';
import React from 'react';
import EventFormDetailsPanel from './EventFormDetailsPanel';
import EventFormRemindersPanel from './EventFormRemindersPanel';
import EventFormSetlistPanel from './EventFormSetlistPanel';
import { PrimaryTab, PrimaryTabs } from './tabs/PrimaryTabs';
import useSetlists from '../hooks/api/useSetlists';
import useTeamMembers from '../hooks/api/useTeamMembers';

export default function EventForm() {
  useSetlists();
  useTeamMembers();

  return (
    <div>
      <Tab.Group as="div" className="col-span-4 pt-4 mb-10 lg:col-span-3">
        <PrimaryTabs>
          <PrimaryTab>Details</PrimaryTab>
          <PrimaryTab>Reminders</PrimaryTab>
          <PrimaryTab>Set</PrimaryTab>
        </PrimaryTabs>
        <Tab.Panels
          as="div"
          className="mt-6 outline-hidden focus:outline-hidden"
        >
          <Tab.Panel as="div" className="outline-hidden focus:outline-hidden">
            <EventFormDetailsPanel />
          </Tab.Panel>
          <Tab.Panel as="div" className="outline-hidden focus:outline-hidden">
            <EventFormRemindersPanel />
          </Tab.Panel>
          <Tab.Panel as="div" className="outline-hidden focus:outline-hidden">
            <EventFormSetlistPanel />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
