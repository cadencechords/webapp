import { useEffect, useState } from 'react';

import Button from './Button';
import { EDIT_SONGS } from '../utils/constants';
import Range from './Range';
import SectionTitle from './SectionTitle';
import SongApi from '../api/SongApi';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';
import Icon from './Icon';
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
  const iconClasses = 'w-14 h-14 text-blue-600 dark:text-dark-blue';
  const [isScrolling, setIsScrolling] = useState(false);
  const [showShortcut, setShowShortcut] = useState(false);
  const [updates, setUpdates] = useState<{ scroll_speed: number } | null>();
  const currentMember = useSelector(selectCurrentMember);
  const [loading, setLoading] = useState(false);
  const [animationFrameId, setAnimationFrameId] = useState<number | null>();

  useEffect(() => {
    setIsScrolling(false);
    setUpdates(null);
    cancelFrame(animationFrameId);
    setAnimationFrameId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.id]);

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

    if (currentMember.can(EDIT_SONGS)) {
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
      await SongApi.updateOneById(song.id, updates);
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
        <SectionTitle
          title={
            <>
              Auto scroll
              {updates && currentMember.can(EDIT_SONGS) && (
                <Button
                  variant="open"
                  size="xs"
                  onClick={handleSaveChanges}
                  className="ml-4"
                  loading={loading}
                >
                  Save changes
                </Button>
              )}
            </>
          }
        />
        <div className="flex-center mb-4">
          <button
            className="outline-hidden focus:outline-hidden"
            onClick={handleToggleScroll}
          >
            {isScrolling ? (
              <Icon name="pause_circle" filled className={iconClasses} />
            ) : (
              <Icon name="play_circle" filled className={iconClasses} />
            )}
          </button>
        </div>
        <div className="pb-2">
          Current speed is
          <span className="font-semibold text-lg ml-2">
            {song.scroll_speed || 1}
          </span>
        </div>
        <Range
          value={song.scroll_speed || 1}
          max={10}
          min={1}
          step={1}
          onChange={handleSpeedChange}
        />
      </div>
      {showShortcut && !bottomSheetOpen && (
        <div className={`fixed flex-center flex-col z-10 ${shortcutClasses}`}>
          <button
            onClick={() =>
              isScrolling ? handlePauseScrolling() : handleStartScrolling()
            }
            className="focus:outline-hidden outline-hidden"
          >
            {isScrolling ? (
              <Icon name="pause_circle" filled className={iconClasses} />
            ) : (
              <Icon name="play_circle" filled className={iconClasses} />
            )}
          </button>
          <button
            className="focus:outline-hidden outline-hidden"
            onClick={handleStopScrolling}
          >
            <Icon
              name="cancel"
              className="w-10 h-10 text-gray-500 dark:text-dark-gray-200"
            />
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
