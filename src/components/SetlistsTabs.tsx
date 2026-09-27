import { Tab } from '@headlessui/react';
import React from 'react';
import { PrimaryTab, PrimaryTabs } from './tabs/PrimaryTabs';

export type SetlistsTab = 'upcoming' | 'past';

type SetlistsTabsProps = {
  selectedTab: SetlistsTab;
  onChange?: (tab: SetlistsTab) => void;
};

export default function SetlistsTabs({
  selectedTab,
  onChange,
}: SetlistsTabsProps) {
  const selectedIndex = selectedTab === 'upcoming' ? 0 : 1;

  function handleChange(newIndex: number) {
    return onChange?.(newIndex === 0 ? 'upcoming' : 'past');
  }
  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={handleChange}>
      <PrimaryTabs className="mb-4">
        <PrimaryTab>Upcoming</PrimaryTab>
        <PrimaryTab>Past</PrimaryTab>
      </PrimaryTabs>
    </Tab.Group>
  );
}
