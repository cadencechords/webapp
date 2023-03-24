import React from 'react';
import Modal from './Modal';
import MarkingTabs from './MarkingTabs';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';

export default function AddMarkingsModal({ open, onClose }) {
  const [selectedTab, setSelectedTab] = React.useState(0);
  return (
    <Modal open={open} onClose={onClose}>
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <MarkingTabs selectedIndex={selectedTab} />
        <Tab.Panels>
          <DynamicOptionsPanel />
          <RoadmapOptionsPanel />
          <SingerOptionsPanel />
          <ShapeOptionsPanel />
        </Tab.Panels>
      </Tab.Group>
    </Modal>
  );
}

function DynamicOptionsPanel() {
  return (
    <Tab.Panel className="grid grid-cols-3 sm:grid-cols-4">
      {dynamicOptions.map(option => (
        <button
          className={classNames(
            defaultOptionClasses,
            'text-xl italic font-bold'
          )}
          style={{ fontFamily: 'Times New Roman' }}
          key={option}
        >
          {option}
        </button>
      ))}
      {volumeOptions.map(option => (
        <button
          className={classNames(defaultOptionClasses, 'text-lg')}
          key={option}
        >
          {option}
        </button>
      ))}
    </Tab.Panel>
  );
}

function RoadmapOptionsPanel() {
  return (
    <Tab.Panel className="grid grid-cols-3 sm:grid-cols-4">
      {roadmapOptions.map(option => (
        <button
          className={classNames(defaultOptionClasses, 'text-lg')}
          key={option}
        >
          {option}
        </button>
      ))}
    </Tab.Panel>
  );
}

function SingerOptionsPanel() {
  return (
    <Tab.Panel className="grid grid-cols-3 sm:grid-cols-4">
      {singerOptions.map(option => (
        <button
          className={classNames(defaultOptionClasses, 'text-lg')}
          key={option}
        >
          {option}
        </button>
      ))}
    </Tab.Panel>
  );
}

function ShapeOptionsPanel() {
  return null;
}

const dynamicOptions = [
  'pp',
  'p',
  'mp',
  'mf',
  'f',
  'ff',
  'pianissimo',
  'piano',
  'mezzo piano',
  'mezzo forte',
  'forte',
  'fortissimo',
];

const volumeOptions = [
  'LOUD',
  'QUIET',
  'BUILD',
  'DROP',
  'MUSIC BUILD',
  'MUSIC DROP',
];

const roadmapOptions = [
  '1X',
  '2X',
  '3X',
  '4X',
  'REPEAT',
  'REPEAT 2X',
  'REPEAT 3X',
  'REPEAT 4X',
  'BREAK',
];

const singerOptions = ['UNISON', 'HARMONY', 'SOLO', 'LEAD SINGER', 'EVERYONE'];

const defaultOptionClasses =
  'h-24 overflow-hidden text-lg whitespace-nowrap overflow-ellipsis dark:hover:bg-dark-gray-600 hover:bg-gray-100 rounded-lg focus:bg-gray-100 dark:focus:bg-dark-gray-600 p-2';
