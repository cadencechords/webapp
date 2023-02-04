import { useEffect, useState } from 'react';

import Button from './Button';
import MetronomeTool from '../tools/metronome';
import MinusIcon from '@heroicons/react/outline/MinusIcon';
import OpenInput from './inputs/OpenInput';
import PauseIcon from '@heroicons/react/solid/PauseIcon';
import PlayIcon from '@heroicons/react/solid/PlayIcon';
import PlusIcon from '@heroicons/react/outline/PlusIcon';
import TapTempo from './TapTempo';

export default function Metronome({ bpm, onBpmChange }) {
  const [isOn, setIsOn] = useState(false);
  const [metronome] = useState(() => new MetronomeTool(bpm));
  const iconClasses = 'w-14 h-14 text-blue-600 dark:text-dark-blue';

  const handleBpmEdited = newBpm => {
    if (parseInt(newBpm) >= 0) {
      if (newBpm !== '') {
        newBpm = Number.parseInt(newBpm);
      }
      onBpmChange(newBpm);
    }
  };

  useEffect(() => {
    metronome.tempo = bpm;
    if (isOn) {
      metronome?.stop();
      metronome?.start();
    }
  }, [bpm, metronome, isOn]);

  useEffect(() => {
    return () => metronome?.stop();
  }, [metronome]);

  const handleToggleMetronome = () => {
    if (isOn) {
      metronome.stop();
      setIsOn(false);
    } else {
      metronome.start();
      setIsOn(true);
    }
  };

  const handlePauseMetronome = () => {
    metronome?.stop();
    setIsOn(false);
  };

  return (
    <>
      <div className="mx-auto mb-4 flex-center">
        <Button
          variant="open"
          bold
          className="mr-2 text-2xl"
          onClick={() => onBpmChange(bpm > 0 ? bpm - 1 : bpm)}
        >
          <MinusIcon className="w-4 h-4" />
        </Button>
        <div className="w-20">
          <OpenInput
            value={bpm || ''}
            className="text-4xl text-center rounded-md hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-dark-gray-600 dark:focus:bg-dark-gray-600"
            onChange={handleBpmEdited}
            placeholder="0"
          />
        </div>
        <Button
          variant="open"
          bold
          className="ml-2 text-2xl"
          onClick={() => onBpmChange(bpm + 1)}
        >
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="relative flex-center">
        <button
          className="outline-none focus:outline-none"
          onClick={handleToggleMetronome}
        >
          {isOn ? (
            <PauseIcon className={iconClasses} />
          ) : (
            <PlayIcon className={iconClasses} />
          )}
        </button>
        <TapTempo onBpmChange={handleBpmEdited} onTap={handlePauseMetronome} />
      </div>
    </>
  );
}
