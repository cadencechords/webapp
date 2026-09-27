import { Tab } from '@headlessui/react';
import classNames from 'classnames';
import { Children, useLayoutEffect, useState } from 'react';
import type { ReactNode } from 'react';

// M3 primary tabs on Headless UI's Tab (keyboard arrows, selection and the
// panels stay Headless UI's). Put PrimaryTabs in a Tab.List's place, inside
// a Tab.Group, with a PrimaryTab per tab.

type PrimaryTabsProps = {
  children?: ReactNode;
  className?: string;
};

/** The row of tabs, with a divider under it and the sliding indicator. */
export function PrimaryTabs({ children, className }: PrimaryTabsProps) {
  // State, not a ref: Headless UI attaches the list's ref after its
  // children's layout effects run, so the indicator waits for it.
  const [list, setList] = useState<HTMLElement | null>(null);

  return (
    <Tab.List
      ref={setList}
      className={classNames(
        'relative flex overflow-x-auto border-b border-outline-variant',
        className
      )}
    >
      {({ selectedIndex }) => (
        <>
          {children}
          <Indicator
            list={list}
            selectedIndex={selectedIndex}
            tabCount={Children.toArray(children).length}
          />
        </>
      )}
    </Tab.List>
  );
}

type PrimaryTabProps = {
  children?: ReactNode;
  className?: string;
};

/** A tab: title-small, primary when selected, with a state layer. */
export function PrimaryTab({ children, className }: PrimaryTabProps) {
  return (
    <Tab
      className={({ selected }) =>
        classNames(
          'shrink-0 flex-center h-12 px-4 font-plain text-title-small whitespace-nowrap',
          'state-layer-flat outline-none focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-secondary focus-visible:-outline-offset-3',
          selected ? 'text-primary' : 'text-on-surface-variant',
          className
        )
      }
    >
      {/* The indicator is as wide as this label. */}
      <span data-tab-label>{children}</span>
    </Tab>
  );
}

type IndicatorProps = {
  list: HTMLElement | null;
  selectedIndex: number;
  tabCount: number;
};

type IndicatorBox = { left: number; width: number };

const SPRING =
  'var(--md-sys-motion-duration-default-spatial) var(--md-sys-motion-easing-default-spatial)';
const SLIDE = `left ${SPRING}, width ${SPRING}`;

// A 3px bar with rounded top corners under the selected tab's label. It
// slides between tabs on the default-spatial spring; the first time it's
// placed it doesn't move, so it doesn't slide in from the left edge.
function Indicator({ list, selectedIndex, tabCount }: IndicatorProps) {
  const [box, setBox] = useState<IndicatorBox | null>(null);
  const [placed, setPlaced] = useState(false);

  useLayoutEffect(() => {
    if (!list) return;

    function measure() {
      if (!list) return;
      const tabs = list.querySelectorAll<HTMLElement>('[role="tab"]');
      const label = tabs
        .item(selectedIndex)
        ?.querySelector<HTMLElement>('[data-tab-label]');
      if (!label) {
        setBox(null);
        return;
      }
      // Layout offsets, not getBoundingClientRect: those ignore transforms,
      // so a dialog still scaling in doesn't shrink the indicator. They're
      // also in the list's scrolled content, where the indicator sits.
      let left = 0;
      let element: Element | null = label;
      while (element instanceof HTMLElement && element !== list) {
        left += element.offsetLeft;
        element = element.offsetParent;
      }
      const width = label.offsetWidth;
      // Hidden (display: none): place it once it's shown, without sliding.
      if (width === 0) {
        setBox(null);
        return;
      }
      setBox(box =>
        box?.left === left && box.width === width ? box : { left, width }
      );
    }

    measure();
    // Labels change width as fonts load and the list as the window resizes.
    // Adding or removing a tab re-runs this (tabCount): in a controlled
    // Tab.Group the selected index stays put while the tab under it changes.
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    list
      .querySelectorAll('[data-tab-label]')
      .forEach(label => observer.observe(label));
    return () => observer.disconnect();
  }, [list, selectedIndex, tabCount]);

  // Scroll the list sideways (only) to bring the selected tab into view, when
  // the tabs overflow: Headless UI focuses tabs without scrolling.
  useLayoutEffect(() => {
    const tab = list
      ?.querySelectorAll<HTMLElement>('[role="tab"]')
      .item(selectedIndex);
    if (!list || !tab) return;
    const start = tab.offsetLeft;
    const end = start + tab.offsetWidth;
    if (start < list.scrollLeft) list.scrollTo?.({ left: start });
    else if (end > list.scrollLeft + list.clientWidth)
      list.scrollTo?.({ left: end - list.clientWidth });
  }, [list, selectedIndex]);

  // Turn the transition on only after the first placement has painted.
  useLayoutEffect(() => {
    if (box && !placed) {
      const frame = requestAnimationFrame(() => setPlaced(true));
      return () => cancelAnimationFrame(frame);
    }
  }, [box, placed]);

  if (!box) return null;
  return (
    <span
      aria-hidden="true"
      data-tab-indicator
      className="absolute bottom-0 h-[3px] rounded-t-[3px] bg-primary pointer-events-none"
      style={{
        left: box.left,
        width: box.width,
        transition: placed ? SLIDE : undefined,
      }}
    />
  );
}
