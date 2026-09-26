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
    <button
      onClick={handleTap}
      className="border-2 border-blue-500 dark:border-dark-blue rounded-md flex-center h-12 w-14 absolute right-2  focus:outline-hidden text-blue-600 dark:text-dark-blue font-medium"
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
