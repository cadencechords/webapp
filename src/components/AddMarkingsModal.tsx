import React from 'react';
import Modal from './Modal';
import MarkingTabs from './MarkingTabs';
import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { shapeOptions } from '../utils/constants';
import { useCreateMarking } from '../hooks/api/markings.hooks';
import { PulseLoader } from 'react-spinners';
import type { Marking, Song } from '../types';

type AddMarkingsModalProps = {
  open: boolean;
  onClose: () => void;
  /** Called with the marking once it's saved. */
  onMarkingAdded: (marking: Marking) => void;
  song: Pick<Song, 'id'>;
};

/** A marking option the user picked. */
type MarkingChoice = { content: string; markingType: string };

type OptionsPanelProps = {
  onAddMarking: (choice: MarkingChoice) => void;
};

export default function AddMarkingsModal({
  open,
  onClose,
  onMarkingAdded,
  song,
}: AddMarkingsModalProps) {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const { isLoading: isCreatingMarking, run: createMarking } = useCreateMarking(
    {
      onSuccess: createdMarking => {
        onMarkingAdded(createdMarking);
        onClose();
      },
    }
  );

  function handleAddMarking({ content, markingType }: MarkingChoice) {
    createMarking({
      marking: { content, marking_type: markingType },
      songId: song.id,
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      headerRight={
        isCreatingMarking && <PulseLoader color="#1f6feb" size={8} />
      }
    >
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <MarkingTabs selectedIndex={selectedTab} />
        <Tab.Panels>
          <DynamicOptionsPanel onAddMarking={handleAddMarking} />
          <RoadmapOptionsPanel onAddMarking={handleAddMarking} />
          <SingerOptionsPanel onAddMarking={handleAddMarking} />
          <ShapeOptionsPanel onAddMarking={handleAddMarking} />
        </Tab.Panels>
      </Tab.Group>
    </Modal>
  );
}

function DynamicOptionsPanel({ onAddMarking }: OptionsPanelProps) {
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
          onClick={() =>
            onAddMarking({ content: option, markingType: 'dynamics' })
          }
        >
          {option}
        </button>
      ))}
      {volumeOptions.map(option => (
        <button
          className={classNames(defaultOptionClasses, 'text-lg')}
          key={option}
          onClick={() =>
            onAddMarking({ content: option, markingType: 'volume' })
          }
        >
          {option}
        </button>
      ))}
    </Tab.Panel>
  );
}

function RoadmapOptionsPanel({ onAddMarking }: OptionsPanelProps) {
  return (
    <Tab.Panel className="grid grid-cols-3 sm:grid-cols-4">
      {roadmapOptions.map(option => (
        <button
          className={classNames(defaultOptionClasses, 'text-lg')}
          key={option}
          onClick={() =>
            onAddMarking({ content: option, markingType: 'roadmap' })
          }
        >
          {option}
        </button>
      ))}
    </Tab.Panel>
  );
}

function SingerOptionsPanel({ onAddMarking }: OptionsPanelProps) {
  return (
    <Tab.Panel className="grid grid-cols-3 sm:grid-cols-4">
      {singerOptions.map(option => (
        <button
          className={classNames(defaultOptionClasses, 'text-lg')}
          key={option}
          onClick={() =>
            onAddMarking({ content: option, markingType: 'singers' })
          }
        >
          {option}
        </button>
      ))}
    </Tab.Panel>
  );
}

function ShapeOptionsPanel({ onAddMarking }: OptionsPanelProps) {
  return (
    <Tab.Panel className="grid grid-cols-3 sm:grid-cols-4">
      {Object.entries(shapeOptions).map(([name, ShapeSvg]) => (
        <button
          className={classNames(defaultOptionClasses, 'text-lg flex-center')}
          key={name}
          onClick={() => onAddMarking({ content: name, markingType: 'shapes' })}
        >
          <ShapeSvg className="w-12 h-12 text-black dark:text-white" />
        </button>
      ))}
      {symbolOptions.map(option => (
        <button
          className={classNames(defaultOptionClasses, 'text-4xl')}
          key={option}
          onClick={() =>
            onAddMarking({ content: option, markingType: 'symbols' })
          }
        >
          {option}
        </button>
      ))}
    </Tab.Panel>
  );
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
  'crescendo',
  'cresc',
  'decrescendo',
  'decresc',
  'diminuendo',
  'dim',
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

const symbolOptions = ['{', '}', '[', ']', '(', ')'];

const defaultOptionClasses =
  'h-24 overflow-hidden text-lg whitespace-nowrap text-ellipsis dark:hover:bg-dark-gray-600 hover:bg-gray-100 rounded-lg focus:bg-gray-100 dark:focus:bg-dark-gray-600 p-2';
