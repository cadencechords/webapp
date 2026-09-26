import { useEffect, useState } from 'react';

import Button from './Button';
import MetronomeTool from '../tools/metronome';
import OpenInput from './inputs/OpenInput';
import TapTempo from './TapTempo';
import Icon from './Icon';

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
          <Icon name="remove" className="w-4 h-4" />
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
          <Icon name="add" className="w-4 h-4" />
        </Button>
      </div>
      <div className="relative flex-center">
        <button
          className="outline-hidden focus:outline-hidden"
          onClick={handleToggleMetronome}
        >
          {isOn ? (
            <Icon name="pause_circle" filled className={iconClasses} />
          ) : (
            <Icon name="play_circle" filled className={iconClasses} />
          )}
        </button>
        <TapTempo onBpmChange={handleBpmEdited} onTap={handlePauseMetronome} />
      </div>
    </>
  );
}
