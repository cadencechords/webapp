import { useEffect, useState } from 'react';

import Button from './Button';
import MetronomeTool from '../tools/metronome';
import OpenInput from './inputs/OpenInput';
import TapTempo from './TapTempo';
import Icon from './Icon';

type MetronomeProps = {
  /** Undefined for a song without a bpm. */
  bpm?: number;
  /** Gets undefined from the minus button when there's no bpm. */
  onBpmChange: (bpm: number | undefined) => void;
};

export default function Metronome({ bpm, onBpmChange }: MetronomeProps) {
  const [isOn, setIsOn] = useState(false);
  const [metronome] = useState(() => new MetronomeTool(bpm));
  const iconClasses = 'w-14 h-14 text-blue-600 dark:text-dark-blue';

  // The input passes a string, TapTempo a number.
  const handleBpmEdited = (newBpm: string | number) => {
    // `as` (both): parseInt converts its argument to a string first, so a
    // number from TapTempo parses the same as its string (120.5 to 120).
    if (parseInt(newBpm as string) >= 0) {
      if (newBpm !== '') {
        newBpm = Number.parseInt(newBpm as string);
      }
      // `as`: it's a number here. '' never gets past the check above:
      // parseInt('') is NaN.
      onBpmChange(newBpm as number);
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
          // Non-null (both): kept as before for a song without a bpm, where
          // `undefined > 0` is false, so this passes undefined on.
          onClick={() => onBpmChange(bpm! > 0 ? bpm! - 1 : bpm)}
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
          // Non-null: kept as before for a song without a bpm, where this is
          // NaN (undefined + 1).
          onClick={() => onBpmChange(bpm! + 1)}
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
