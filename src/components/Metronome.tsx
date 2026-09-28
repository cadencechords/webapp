import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject, ReactNode } from 'react';

import MetronomeTool from '../tools/metronome';
import OpenInput from './inputs/OpenInput';
import PlayToggleButton from './buttons/PlayToggleButton';
import Range from './Range';
import TapTempo from './TapTempo';
import Icon from './Icon';

type MetronomeProps = {
  /** Undefined for a song without a bpm. */
  bpm?: number;
  /** Gets undefined from the minus button when there's no bpm. */
  onBpmChange: (bpm: number | undefined) => void;
};

/**
 * The ref's metronome, created on first use. Only effects and handlers use
 * it, and the tempo effect sets its tempo straight away.
 */
function metronomeIn(ref: MutableRefObject<MetronomeTool | null>) {
  if (ref.current === null) {
    ref.current = new MetronomeTool();
  }
  return ref.current;
}

export default function Metronome({ bpm, onBpmChange }: MetronomeProps) {
  const [isOn, setIsOn] = useState(false);
  // A ref, not state: the effect below sets its tempo in place.
  const metronomeRef = useRef<MetronomeTool | null>(null);

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
    const metronome = metronomeIn(metronomeRef);
    metronome.tempo = bpm;
    if (isOn) {
      metronome.stop();
      metronome.start();
    }
  }, [bpm, isOn]);

  useEffect(() => {
    const metronome = metronomeIn(metronomeRef);
    return () => metronome.stop();
  }, []);

  const handleToggleMetronome = () => {
    if (isOn) {
      metronomeIn(metronomeRef).stop();
      setIsOn(false);
    } else {
      metronomeIn(metronomeRef).start();
      setIsOn(true);
    }
  };

  const handlePauseMetronome = () => {
    metronomeIn(metronomeRef).stop();
    setIsOn(false);
  };

  return (
    <>
      <div className="mx-auto mb-4 flex-center gap-4">
        <button
          type="button"
          aria-label="Decrease tempo"
          className={STEP_BUTTON}
          // Non-null (both): kept as before for a song without a bpm, where
          // `undefined > 0` is false, so this passes undefined on.
          onClick={() => onBpmChange(bpm! > 0 ? bpm! - 1 : bpm)}
        >
          <Icon name="remove" className="w-6 h-6" />
        </button>
        <label className="flex flex-col items-center w-28">
          <OpenInput
            value={bpm || ''}
            className="text-display-large-emphasized text-center rounded-md"
            onChange={handleBpmEdited}
            placeholder="0"
          />
          <span className="text-label-large text-on-surface-variant">BPM</span>
        </label>
        <button
          type="button"
          aria-label="Increase tempo"
          className={STEP_BUTTON}
          // Non-null: kept as before for a song without a bpm, where this is
          // NaN (undefined + 1).
          onClick={() => onBpmChange(bpm! + 1)}
        >
          <Icon name="add" className="w-6 h-6" />
        </button>
      </div>
      <div className="px-2 mt-10 mb-6">
        <Range
          min={MIN_BPM}
          max={MAX_BPM}
          step={1}
          value={sliderBpm(bpm)}
          onChange={onBpmChange}
        />
        <SliderEnds start={MIN_BPM} end={MAX_BPM} />
      </div>
      <div className="relative flex-center">
        <PlayToggleButton
          playing={isOn}
          label={isOn ? 'Stop metronome' : 'Start metronome'}
          onClick={handleToggleMetronome}
        />
        <TapTempo onBpmChange={handleBpmEdited} onTap={handlePauseMetronome} />
      </div>
    </>
  );
}

export const MIN_BPM = 30;
export const MAX_BPM = 250;

/**
 * Where the slider sits for a bpm: clamped to its range, and at the low end
 * for a song without one (undefined, 0, or NaN from plus), so the input stays
 * controlled.
 */
export function sliderBpm(bpm: number | undefined) {
  return Math.min(MAX_BPM, Math.max(MIN_BPM, bpm || MIN_BPM));
}

/** What a slider's ends mean, in label-medium under them. */
export function SliderEnds({
  start,
  end,
}: {
  start: ReactNode;
  end: ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className="flex justify-between mt-1 font-plain text-label-medium text-on-surface-variant"
    >
      <span>{start}</span>
      <span>{end}</span>
    </div>
  );
}

// M3E medium tonal icon button, on the neutral container.
export const STEP_BUTTON =
  'flex-center shrink-0 w-14 h-14 rounded-[28px] [--shape-morph-to:16px] bg-surface-container-highest text-on-surface-variant state-layer-flat focus-ring shape-morph';
