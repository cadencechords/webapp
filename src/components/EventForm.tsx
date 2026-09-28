import { Tab } from '@headlessui/react';
import EventColorOptions from './EventColorOptions';
import EventFormDetailsPanel from './EventFormDetailsPanel';
import EventFormRemindersPanel from './EventFormRemindersPanel';
import EventFormSetlistPanel from './EventFormSetlistPanel';
import SectionTitle from './SectionTitle';
import { PrimaryTab, PrimaryTabs } from './tabs/PrimaryTabs';
import useEventForm from '../hooks/forms/useEventForm';
import useSetlists from '../hooks/api/useSetlists';
import useTeamMembers from '../hooks/api/useTeamMembers';

const PANEL_CLASSES = 'outline-hidden focus:outline-hidden';

// The event in three tabs: its details and color, its reminders, and its set.
export default function EventForm() {
  useSetlists();
  useTeamMembers();
  const { form, onChange } = useEventForm();

  return (
    <Tab.Group as="div" className="pb-10">
      <PrimaryTabs>
        <PrimaryTab>Details</PrimaryTab>
        <PrimaryTab>Reminders</PrimaryTab>
        <PrimaryTab>Set</PrimaryTab>
      </PrimaryTabs>
      <Tab.Panels as="div" className={`mt-6 ${PANEL_CLASSES}`}>
        <Tab.Panel as="div" className={`flex flex-col gap-8 ${PANEL_CLASSES}`}>
          <EventFormDetailsPanel />
          <section>
            <SectionTitle title="Color" className="mb-3" />
            <EventColorOptions
              onClick={value => onChange('color', value)}
              selectedColor={form.color}
            />
          </section>
        </Tab.Panel>
        <Tab.Panel as="div" className={PANEL_CLASSES}>
          <EventFormRemindersPanel />
        </Tab.Panel>
        <Tab.Panel as="div" className={PANEL_CLASSES}>
          <EventFormSetlistPanel />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
