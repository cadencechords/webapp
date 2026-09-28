import Icon from './Icon';
import type { Song } from '../types';

type SetlistNavigationProps = {
  songs: Song[];
  onIndexChange: (index: number) => void;
  index: number;
};

// An M3 Expressive floating toolbar over the song: previous as a standard
// icon button, where the song is in the set and what's next, and next as
// a filled icon button (the toolbar's main action). Always shown, unlike the
// top app bar, so the next song is always a tap away.
export default function SetlistNavigation({
  songs,
  onIndexChange,
  index,
}: SetlistNavigationProps) {
  const isFirst = index === 0;
  const isLast = index >= songs.length - 1;
  const previousSong = songs[index - 1];
  const nextSong = songs[index + 1];

  return (
    <div className="fixed inset-x-0 z-30 flex justify-center px-4 pointer-events-none bottom-[max(1rem,env(safe-area-inset-bottom))]">
      <nav
        aria-label="Set"
        className="flex items-center w-full max-w-md gap-1 p-2 rounded-full pointer-events-auto bg-surface-container-high text-on-surface shadow-(--md-sys-elevation-level3)"
      >
        <button
          type="button"
          aria-label={
            previousSong ? `Previous: ${previousSong.name}` : 'Previous song'
          }
          disabled={isFirst}
          onClick={() => onIndexChange(index - 1)}
          className="flex-center w-12 h-12 shrink-0 rounded-full text-on-surface-variant state-layer-flat focus-ring disabled:opacity-38 disabled:pointer-events-none"
        >
          <Icon name="arrow_back" className="w-6 h-6" />
        </button>

        <div className="flex-1 min-w-0 px-2 text-center font-plain">
          <div className="text-label-medium text-on-surface-variant">
            {index + 1} of {songs.length}
          </div>
          <div className="truncate text-body-medium">
            {isLast ? 'End of set' : `Next: ${nextSong?.name}`}
          </div>
        </div>

        <button
          type="button"
          aria-label={nextSong ? `Next: ${nextSong.name}` : 'Next song'}
          disabled={isLast}
          onClick={() => onIndexChange(index + 1)}
          className="flex-center w-14 h-12 shrink-0 rounded-[24px] bg-primary text-on-primary state-layer-flat focus-ring shape-morph [--shape-morph-to:16px] disabled:bg-on-surface/12 disabled:text-on-surface/38 disabled:pointer-events-none"
        >
          <Icon name="arrow_forward" className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}
