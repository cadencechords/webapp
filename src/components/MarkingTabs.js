import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import React from 'react';
import { markingTabs } from '../utils/constants';

export default function MarkingTabs({ selectedIndex }) {
  return (
    <Tab.List className="flex gap-3 mb-4 text-sm font-semibold text-gray-700 dark:text-dark-gray-200">
      {markingTabs.map((tab, index) => (
        <Tab
          key={tab}
          className={classNames(
            'rounded-full h-7 px-3 outline-none focus:outline-none transition-colors',
            selectedIndex === index
              ? 'text-white bg-blue-600 dark:bg-dark-blue'
              : 'hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-dark-gray-700 dark:focus:bg-dark-gray-700'
          )}
        >
          {tab}
        </Tab>
      ))}
    </Tab.List>
  );
}
