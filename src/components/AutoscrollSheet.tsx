import { useEffect, useState } from 'react';

import { EDIT_SONGS } from '../utils/constants';
import Range from './Range';
import SheetHeader from './SheetHeader';
import { SliderEnds, STEP_BUTTON } from './Metronome';
import SongApi from '../api/SongApi';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import Icon from './Icon';
import PlayToggleButton from './buttons/PlayToggleButton';
import type { Song } from '../types';

type AutoscrollSheetProps = {
  song: Song;
  onSongChange: (field: 'scroll_speed', value: number) => void;
  className?: string;
  /** Hides the floating play/stop shortcut while the bottom sheet is open. */
  bottomSheetOpen?: boolean;
  shortcutClasses?: string;
};

export default function AutoscrollSheet({
  song,
  onSongChange,
  className = '',
  bottomSheetOpen,
  shortcutClasses = '',
}: AutoscrollSheetProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [showShortcut, setShowShortcut] = useState(false);
  const [updates, setUpdates] = useState<{ scroll_speed: number } | null>();
  const currentMember = useSelector(selectCurrentMember);
  const [loading, setLoading] = useState(false);
  const [animationFrameId, setAnimationFrameId] = useState<number | null>();
  const speed = song.scroll_speed || 1;

  // Another song stops scrolling and drops unsaved speed changes. Clearing
  // the frame id cancels the running frame, through the cleanup below.
  const [previousSongId, setPreviousSongId] = useState(song.id);
  if (song.id !== previousSongId) {
    setPreviousSongId(song.id);
    setIsScrolling(false);
    setUpdates(null);
    setAnimationFrameId(null);
  }

  useEffect(() => {
    return () => cancelFrame(animationFrameId);
  }, [animationFrameId]);

  function handleToggleScroll() {
    if (isScrolling) {
      handleStopScrolling();
    } else {
      setShowShortcut(true);
      setIsScrolling(true);
      const { px, interval } = SPEEDS[song.scroll_speed || 1];
      setAnimationFrameId(requestAnimationFrame(() => scroll(0, px, interval)));
    }
  }

  function handleSpeedChange(newSpeed: number) {
    cancelFrame(animationFrameId);
    setAnimationFrameId(null);

    // Non-null: kept as before, this throws if the membership hasn't loaded.
    if (currentMember!.can(EDIT_SONGS)) {
      setUpdates({ scroll_speed: newSpeed });
    }

    if (isScrolling) {
      const { px, interval } = SPEEDS[newSpeed || 1];
      setAnimationFrameId(requestAnimationFrame(() => scroll(0, px, interval)));
    }
    onSongChange('scroll_speed', newSpeed);
  }

  function isAtBottom(element: HTMLElement) {
    return (
      Math.abs(
        element.scrollHeight - element.scrollTop - element.clientHeight
      ) <= 13
    );
  }

  function handleStopScrolling() {
    cancelFrame(animationFrameId);
    setAnimationFrameId(null);
    setIsScrolling(false);
    setShowShortcut(false);
  }

  function handlePauseScrolling() {
    cancelFrame(animationFrameId);
    setIsScrolling(false);
    setAnimationFrameId(null);
  }

  function handleStartScrolling() {
    setIsScrolling(true);
    const { px, interval } = SPEEDS[song?.scroll_speed || 1];
    // This passes an updater, not a frame id: React calls it when it processes
    // the update (twice under StrictMode), which starts scrolling, and stores
    // its `undefined` return as the id.
    setAnimationFrameId(() => {
      scroll(0, px, interval);
      return undefined;
    });
  }

  function scroll(time: number, px: number, interval: number) {
    const page = document.querySelector('html') as HTMLElement;
    const currentScrollPosition = page.scrollTop;
    if (isAtBottom(page)) {
      cancelFrame(animationFrameId);
      setAnimationFrameId(null);
      setIsScrolling(false);
    } else {
      if (time % interval === 0) {
        page.scroll({
          top: currentScrollPosition + px,
          left: page.scrollLeft,
          behavior: 'smooth',
        });
      }
      setAnimationFrameId(
        requestAnimationFrame(() => scroll(time + 1, px, interval))
      );
    }
  }

  async function handleSaveChanges() {
    try {
      setLoading(true);
      // Only the save button calls this, and it renders only with updates.
      await SongApi.updateOneById(song.id, updates!);
    } catch (error) {
      reportError(error);
    } finally {
      setLoading(false);
      setUpdates(null);
    }
  }

  return (
    <>
      <div className={` ${className}`}>
        <SheetHeader
          title="Auto scroll"
          // Non-null: updates are set only once can() passed above.
          onSave={
            updates && currentMember!.can(EDIT_SONGS)
              ? handleSaveChanges
              : undefined
          }
          saving={loading}
        />
        <div className="flex-center gap-4">
          <button
            type="button"
            aria-label="Slower"
            disabled={speed <= MIN_SPEED}
            className={`${STEP_BUTTON} disabled:opacity-38 disabled:pointer-events-none`}
            onClick={() => handleSpeedChange(speed - 1)}
          >
            <Icon name="remove" className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center w-28 font-plain">
            <span className="text-display-large-emphasized text-on-surface">
              {speed}
            </span>
            <span className="text-label-large text-on-surface-variant">
              Speed
            </span>
          </div>
          <button
            type="button"
            aria-label="Faster"
            disabled={speed >= MAX_SPEED}
            className={`${STEP_BUTTON} disabled:opacity-38 disabled:pointer-events-none`}
            onClick={() => handleSpeedChange(speed + 1)}
          >
            <Icon name="add" className="w-6 h-6" />
          </button>
        </div>
        <div className="px-2 mt-10 mb-6">
          <Range
            value={speed}
            max={MAX_SPEED}
            min={MIN_SPEED}
            step={1}
            onChange={handleSpeedChange}
          />
          <SliderEnds start="Slower" end="Faster" />
        </div>
        <div className="flex-center">
          <PlayToggleButton
            playing={isScrolling}
            label={isScrolling ? 'Pause auto scroll' : 'Start auto scroll'}
            onClick={handleToggleScroll}
          />
        </div>
      </div>
      {showShortcut && !bottomSheetOpen && (
        <div className={`fixed flex-center flex-col z-10 ${shortcutClasses}`}>
          <PlayToggleButton
            size="medium"
            playing={isScrolling}
            label={isScrolling ? 'Pause auto scroll' : 'Resume auto scroll'}
            onClick={() =>
              isScrolling ? handlePauseScrolling() : handleStartScrolling()
            }
          />
          {/* M3E medium tonal icon button */}
          <button
            type="button"
            aria-label="Stop auto scroll"
            className="flex-center mt-2 w-14 h-14 rounded-[28px] [--shape-morph-to:16px] bg-surface-container-highest text-on-surface-variant state-layer-flat focus-ring shape-morph"
            onClick={handleStopScrolling}
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
}

// cancelAnimationFrame(undefined) and (null) cancel nothing, the same as not
// calling it, since frame ids start at 1.
function cancelFrame(id: number | null | undefined) {
  if (id != null) cancelAnimationFrame(id);
}

const MIN_SPEED = 1;
const MAX_SPEED = 10;

const SPEEDS: Record<number, { px: number; interval: number }> = {
  1: { px: 1, interval: 15 },
  2: { px: 1, interval: 13 },
  3: { px: 1, interval: 11 },
  4: { px: 1, interval: 9 },
  5: { px: 1, interval: 7 },
  6: { px: 1, interval: 5 },
  7: { px: 1, interval: 4 },
  8: { px: 1, interval: 3 },
  9: { px: 2, interval: 4 },
  10: { px: 3, interval: 3 },
};
