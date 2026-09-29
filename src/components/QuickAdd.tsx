import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import type { OutlinedIconName } from './icons/registry';

type QuickAddProps = {
  onAdd: () => void;
  /** What it adds, e.g. "New song": the FAB's label. */
  label?: string;
  /** The leading icon: add by default. */
  icon?: OutlinedIconName;
};

const SPRING =
  'var(--md-sys-motion-duration-default-spatial) var(--md-sys-motion-easing-default-spatial)';

// An M3 extended FAB, a step up from the 56dp size: 64dp tall, 20dp
// corners, a 28dp icon and a title-medium label, 18dp before the icon, 12dp
// between it and the label, 22dp after; in M3 Expressive's tertiary
// container color set (tertiary-container with on-tertiary-container
// content), flat (level 1 hovered). It sits 16dp above the mobile
// navigation bar, and 16dp inside the content sheet's corner from md.
//
// Scrolling down collapses it to a 64dp square FAB; scrolling up, or
// reaching the top, extends it again. The label stays in the DOM (so it still
// names the button) while its width, spacing and opacity animate on the
// default spatial spring.
export default function QuickAdd({
  onAdd,
  label = 'Add',
  icon = 'add',
}: QuickAddProps) {
  const extended = useExtendedOnScroll();

  return (
    <button
      type="button"
      onClick={onAdd}
      className="fixed z-20 flex items-center h-16 px-[18px] right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] md:right-7 md:bottom-7 rounded-large-increased bg-tertiary-container text-on-tertiary-container font-plain text-title-medium whitespace-nowrap hover:shadow-(--md-sys-elevation-level1) transition-fast-effects state-layer-flat focus-ring"
    >
      <Icon name={icon} className="w-7 h-7 shrink-0" />
      <span
        className={classNames(
          'overflow-hidden',
          extended
            ? 'max-w-60 ml-3 mr-1 opacity-100'
            : 'max-w-0 ml-0 mr-0 opacity-0'
        )}
        style={{
          transition: `max-width ${SPRING}, margin ${SPRING}, opacity var(--md-sys-motion-duration-fast-effects) var(--md-sys-motion-easing-fast-effects)`,
        }}
      >
        {label}
      </span>
    </button>
  );
}

// Whether the FAB is extended: collapsed while scrolling down, extended while
// scrolling up or near the top. Scroll events don't bubble, so it listens in
// the capture phase, and follows only the page: the window (phones) and the
// content sheet (data-page-scroller), which scrolls itself from md. Other
// scrolling, like a list in a dialog, leaves it alone.
function useExtendedOnScroll() {
  const [extended, setExtended] = useState(true);
  const lastTop = useRef(0);

  useEffect(() => {
    function handleScroll(event: Event) {
      const target = event.target;
      if (
        target instanceof Element &&
        !target.hasAttribute('data-page-scroller')
      )
        return;
      const top = target instanceof Element ? target.scrollTop : window.scrollY;
      const previous = lastTop.current;
      lastTop.current = top;
      if (top < 16) setExtended(true);
      else if (top > previous + 4) setExtended(false);
      else if (top < previous - 4) setExtended(true);
    }
    document.addEventListener('scroll', handleScroll, {
      capture: true,
      passive: true,
    });
    return () =>
      document.removeEventListener('scroll', handleScroll, { capture: true });
  }, []);

  return extended;
}
