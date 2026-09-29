import { useEffect, useState } from 'react';

/** How far the page has to move before the bars hide or come back. */
const THRESHOLD = 8;
/** Within this of the bottom, the bars come back: the song has ended. */
const BOTTOM_MARGIN = 48;

/**
 * The M3 top app bar behavior, on the window's scroll:
 * `hidden` while scrolling down (autoscroll included) and false again on
 * scrolling up, near the top or at the bottom; `scrolled` once the page is
 * off the top, for the bar's scrolled-under color. Never hidden while
 * `enabled` is false.
 */
export default function useHideOnScroll(enabled = true) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 0);

  useEffect(() => {
    let lastY = window.scrollY;

    function handleScroll() {
      const y = window.scrollY;
      const atBottom =
        window.innerHeight + y >=
        document.documentElement.scrollHeight - BOTTOM_MARGIN;

      setScrolled(y > 0);
      if (y <= THRESHOLD || atBottom) {
        setHidden(false);
      } else if (Math.abs(y - lastY) >= THRESHOLD) {
        setHidden(y > lastY);
      } else {
        return;
      }
      lastY = y;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { hidden: enabled && hidden, scrolled };
}
