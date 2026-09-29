import { useState } from 'react';

type TapTempoProps = {
  onBpmChange: (bpm: number) => void;
  onTap: () => void;
};

export default function TapTempo({ onBpmChange, onTap }: TapTempoProps) {
  /** When the previous tap happened, in milliseconds since the epoch. */
  const [currentTapTime, setCurrentTapTime] = useState<number | undefined>();

  const handleTap = () => {
    onTap();
    const previous = currentTapTime;

    const current = new Date().getTime();
    setCurrentTapTime(current);

    if (previous && current) {
      const newBpm = calculateBpm(previous, current);
      onBpmChange(newBpm);
    }
  };

  return (
    // M3E medium tonal button, on the neutral container.
    <button
      type="button"
      onClick={handleTap}
      className="absolute right-2 h-14 px-6 rounded-[28px] [--shape-morph-to:12px] bg-surface-container-highest text-on-surface-variant text-title-medium font-plain state-layer-flat focus-ring shape-morph"
    >
      Tap
    </button>
  );
}

function calculateBpm(previousTime: number, currentTime: number) {
  if (previousTime && currentTime) {
    const secondsPerBeat = (currentTime - previousTime) / 1000;
    const bpm = 60.0 / secondsPerBeat;
    return bpm;
  } else {
    return 0;
  }
}
