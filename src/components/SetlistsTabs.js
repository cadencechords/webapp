import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import React from 'react';

export default function SetlistsTabs({ selectedTab, onChange }) {
  const selectedIndex = selectedTab === 'upcoming' ? 0 : 1;

  function handleChange(newIndex) {
    return onChange?.(newIndex === 0 ? 'upcoming' : 'past');
  }
  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={handleChange}>
      <Tab.List className="flex gap-3 mb-4 text-sm font-semibold text-gray-700 dark:text-dark-gray-200">
        <Tab
          className={classNames(
            'rounded-full h-7 px-3 outline-none focus:outline-none transition-colors',
            selectedIndex === 0
              ? 'text-white bg-blue-600 dark:bg-dark-blue'
              : 'hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-dark-gray-700 dark:focus:bg-dark-gray-700'
          )}
        >
          Upcoming
        </Tab>
        <Tab
          className={classNames(
            'rounded-full h-7 px-3 outline-none focus:outline-none transition-colors',
            selectedIndex === 1
              ? 'text-white bg-blue-600 dark:bg-dark-blue'
              : 'hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-dark-gray-700 dark:focus:bg-dark-gray-700'
          )}
        >
          Past
        </Tab>
      </Tab.List>
    </Tab.Group>
  );
}
