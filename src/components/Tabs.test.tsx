import { Tab } from '@headlessui/react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import MarkingTabs from './MarkingTabs';
import SongTabs from './SongTabs';
import { PrimaryTab, PrimaryTabs } from './tabs/PrimaryTabs';
import { VIEW_FILES, markingTabs } from '../utils/constants';
import { renderWithProvider } from '../utils/test';
import type { Song } from '../types';

// The Files panel loads files from the API; only the tabs matter here.
vi.mock('./SongFilesTab', () => ({ default: () => <p>Files panel</p> }));

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// jsdom has no layout: each tab starts 100px after the one before, its label
// 16px in and 8px per letter wide. The tab is the label's offset parent and
// the list the tab's. getBoundingClientRect reports all of it at 90%, as in
// a dialog that's still scaling in, which the indicator mustn't follow.
function stubLayout() {
  const isLabel = (element: HTMLElement) =>
    element.hasAttribute('data-tab-label');
  const isTab = (element: HTMLElement) =>
    element.getAttribute('role') === 'tab';
  vi.spyOn(HTMLElement.prototype, 'offsetParent', 'get').mockImplementation(
    function (this: HTMLElement) {
      return isLabel(this) || isTab(this) ? this.parentElement : null;
    }
  );
  vi.spyOn(HTMLElement.prototype, 'offsetLeft', 'get').mockImplementation(
    function (this: HTMLElement) {
      if (isLabel(this)) return 16;
      if (isTab(this)) {
        const tabs = [...(this.parentElement?.children ?? [])];
        return tabs.indexOf(this) * 100;
      }
      return 0;
    }
  );
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(
    function (this: HTMLElement) {
      return isLabel(this) ? (this.textContent ?? '').length * 8 : 400;
    }
  );
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: HTMLElement) {
      const width =
        (isLabel(this) ? (this.textContent ?? '').length * 8 : 400) * 0.9;
      return {
        left: 0,
        width,
        top: 0,
        height: 18,
        right: width,
        bottom: 18,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      };
    }
  );
}

function ThreeTabs({ onChange }: { onChange?: (index: number) => void }) {
  return (
    <Tab.Group onChange={onChange}>
      <PrimaryTabs>
        <PrimaryTab>Details</PrimaryTab>
        <PrimaryTab>Reminders</PrimaryTab>
        <PrimaryTab>Set</PrimaryTab>
      </PrimaryTabs>
      <Tab.Panels>
        <Tab.Panel>Details panel</Tab.Panel>
        <Tab.Panel>Reminders panel</Tab.Panel>
        <Tab.Panel>Set panel</Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

test('primary tabs: title-small, primary when selected, with state layers', () => {
  render(<ThreeTabs />);
  const tabs = screen.getAllByRole('tab');
  expect(tabs.map(tab => tab.textContent)).toEqual([
    'Details',
    'Reminders',
    'Set',
  ]);
  expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  expect(tabs[0]).toHaveClass('text-primary', 'text-title-small', 'h-12');
  expect(tabs[1]).toHaveClass('text-on-surface-variant', 'state-layer-flat');
  // relative: the indicator and the labels' offsets are measured from it.
  expect(screen.getByRole('tablist')).toHaveClass(
    'relative',
    'border-b',
    'border-outline-variant',
    'overflow-x-auto'
  );
  expect(tabs[0]).toHaveClass(
    'focus-visible:outline-3',
    'focus-visible:-outline-offset-3'
  );
});

test('arrow keys still move between tabs and show their panels', () => {
  const onChange = vi.fn<(index: number) => void>();
  render(<ThreeTabs onChange={onChange} />);
  const [details] = screen.getAllByRole('tab');
  details.focus();
  fireEvent.keyDown(details, { key: 'ArrowRight' });
  expect(onChange).toHaveBeenLastCalledWith(1);
  expect(screen.getByRole('tab', { name: 'Reminders' })).toHaveAttribute(
    'aria-selected',
    'true'
  );
  expect(screen.getByText('Reminders panel')).toBeInTheDocument();
  fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowLeft' });
  expect(onChange).toHaveBeenLastCalledWith(0);
});

test('the indicator sits under the selected label, as wide as it (even while scaled), and slides after the first placement', () => {
  stubLayout();
  const frames: FrameRequestCallback[] = [];
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    frames.push(callback);
    return frames.length;
  });
  const { container } = render(<ThreeTabs />);
  const indicator = () =>
    container.querySelector('[data-tab-indicator]') as HTMLElement;

  expect(indicator()).toHaveClass('h-[3px]', 'rounded-t-[3px]', 'bg-primary');
  expect(indicator().style.left).toBe('16px');
  expect(indicator().style.width).toBe(`${'Details'.length * 8}px`);
  // Placed without a transition, so it doesn't slide in from the edge.
  expect(indicator().style.transition).toBe('');

  act(() => frames.forEach(frame => frame(0)));
  expect(indicator().style.transition).toContain(
    'var(--md-sys-motion-duration-default-spatial)'
  );

  fireEvent.click(screen.getByRole('tab', { name: 'Set' }));
  expect(indicator().style.left).toBe('216px');
  expect(indicator().style.width).toBe(`${'Set'.length * 8}px`);
});

test('the indicator follows a label that resizes', () => {
  stubLayout();
  const measures: ResizeObserverCallback[] = [];
  const observed = new Set<Element>();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ResizeObserverCallback) {
        measures.push(callback);
      }
      observe(target: Element) {
        observed.add(target);
      }
      disconnect() {
        observed.clear();
      }
    }
  );
  const { container } = render(<ThreeTabs />);
  // The labels themselves: a label can grow without the list resizing.
  expect(observed).toContain(screen.getByText('Details'));
  expect(observed).toContain(screen.getByRole('tablist'));
  const indicator = container.querySelector(
    '[data-tab-indicator]'
  ) as HTMLElement;
  expect(indicator.style.width).toBe(`${'Details'.length * 8}px`);

  // Say the web font loads and the label grows to 70px.
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(70);
  act(() => measures.forEach(measure => measure([], {} as ResizeObserver)));
  expect(indicator.style.width).toBe('70px');
});

test('a tab added before the selected one moves the indicator with it', () => {
  stubLayout();
  function Later({ withFirst }: { withFirst: boolean }) {
    return (
      <Tab.Group>
        <PrimaryTabs>
          {withFirst && <PrimaryTab>Details</PrimaryTab>}
          <PrimaryTab>Set</PrimaryTab>
        </PrimaryTabs>
      </Tab.Group>
    );
  }
  const { container, rerender } = render(<Later withFirst={false} />);
  const indicator = () =>
    container.querySelector('[data-tab-indicator]') as HTMLElement;
  expect(indicator().style.left).toBe('16px');

  rerender(<Later withFirst />);
  // "Set" stays selected, now second and 100px along.
  expect(screen.getByRole('tab', { name: 'Set' })).toHaveAttribute(
    'aria-selected',
    'true'
  );
  expect(indicator().style.left).toBe('116px');
  expect(indicator().style.width).toBe(`${'Set'.length * 8}px`);
});

test('in a controlled group, a tab inserted at the selected index moves the indicator to it', () => {
  stubLayout();
  function Controlled({ withReminders }: { withReminders: boolean }) {
    return (
      <Tab.Group selectedIndex={1} onChange={() => {}}>
        <PrimaryTabs>
          <PrimaryTab>Details</PrimaryTab>
          {withReminders && <PrimaryTab>Reminders</PrimaryTab>}
          <PrimaryTab>Set</PrimaryTab>
        </PrimaryTabs>
      </Tab.Group>
    );
  }
  const { container, rerender } = render(<Controlled withReminders={false} />);
  const indicator = () =>
    container.querySelector('[data-tab-indicator]') as HTMLElement;
  expect(indicator().style.width).toBe(`${'Set'.length * 8}px`);

  rerender(<Controlled withReminders />);
  expect(indicator().style.left).toBe('116px');
  expect(indicator().style.width).toBe(`${'Reminders'.length * 8}px`);
});

test('a list mounted hidden gets its indicator when shown, without sliding in', () => {
  stubLayout();
  const measures: ResizeObserverCallback[] = [];
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ResizeObserverCallback) {
        measures.push(callback);
      }
      observe() {}
      disconnect() {}
    }
  );
  const frames: FrameRequestCallback[] = [];
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    frames.push(callback);
    return frames.length;
  });
  const width = vi
    .spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
    .mockReturnValue(0);
  const { container } = render(<ThreeTabs />);
  const indicator = () =>
    container.querySelector('[data-tab-indicator]') as HTMLElement | null;
  expect(indicator()).toBeNull();
  act(() => frames.forEach(frame => frame(0)));

  // Shown: the labels get their widths.
  width.mockReturnValue(56);
  act(() => measures.forEach(measure => measure([], {} as ResizeObserver)));
  expect(indicator()?.style.left).toBe('16px');
  expect(indicator()?.style.transition).toBe('');
});

test('removing the selected tab removes the indicator', () => {
  stubLayout();
  function Removable({ withSet }: { withSet: boolean }) {
    return (
      <Tab.Group selectedIndex={1} onChange={() => {}}>
        <PrimaryTabs>
          <PrimaryTab>Details</PrimaryTab>
          {withSet && <PrimaryTab>Set</PrimaryTab>}
        </PrimaryTabs>
      </Tab.Group>
    );
  }
  const { container, rerender } = render(<Removable withSet />);
  expect(container.querySelector('[data-tab-indicator]')).not.toBeNull();
  rerender(<Removable withSet={false} />);
  expect(container.querySelector('[data-tab-indicator]')).toBeNull();
});

test('selecting a tab scrolls it into view, sideways, when the tabs overflow', () => {
  stubLayout();
  render(<ThreeTabs />);
  const list = screen.getByRole('tablist');
  // A 150px list, scrolled to the start: "Set" (200-300) is out of view.
  let scrollLeft = 0;
  Object.defineProperty(list, 'clientWidth', { value: 150 });
  Object.defineProperty(list, 'scrollLeft', { get: () => scrollLeft });
  list.scrollTo = ((options: ScrollToOptions) => {
    scrollLeft = options.left ?? scrollLeft;
  }) as typeof list.scrollTo;
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(100);

  fireEvent.click(screen.getByRole('tab', { name: 'Set' }));
  expect(scrollLeft).toBe(150);
  fireEvent.click(screen.getByRole('tab', { name: 'Details' }));
  expect(scrollLeft).toBe(0);
});

describe('SongTabs', () => {
  const song = { id: 1, name: 'Amazing Grace', tracks: [] } as unknown as Song;
  const state = (isPro: boolean) => ({
    subscription: { subscription: { isPro } },
    auth: { currentUser: { id: 1, role: { permissions: [] } } },
  });

  test('is left out without Pro: no empty tab bar', () => {
    renderWithProvider(
      <SongTabs
        song={song}
        onTrackDeleted={() => {}}
        onTracksAdded={() => {}}
      />,
      { preloadedState: state(false) }
    );
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  test('shows Files, selected, then Tracks to Pro members who can view files', () => {
    renderWithProvider(
      <SongTabs
        song={song}
        onTrackDeleted={() => {}}
        onTracksAdded={() => {}}
      />,
      {
        preloadedState: {
          ...state(true),
          auth: {
            currentUser: {
              id: 1,
              role: { permissions: [{ name: VIEW_FILES }] },
            },
          },
        },
      }
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map(tab => tab.textContent)).toEqual(['Files', 'Tracks']);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Files panel')).toBeInTheDocument();
  });

  test('shows Tracks alone to Pro members who cannot view files', () => {
    renderWithProvider(
      <SongTabs
        song={song}
        onTrackDeleted={() => {}}
        onTracksAdded={() => {}}
      />,
      { preloadedState: state(true) }
    );
    expect(screen.getAllByRole('tab').map(tab => tab.textContent)).toEqual([
      'Tracks',
    ]);
    // Each tab keeps its own panel: Files' panel isn't shown under Tracks.
    expect(screen.getByText('Add track')).toBeInTheDocument();
    expect(screen.queryByText('Files panel')).not.toBeInTheDocument();
  });
});

test('MarkingTabs keeps its tabs, order and default tab', () => {
  render(
    <Tab.Group>
      <MarkingTabs />
      <Tab.Panels>
        {markingTabs.map(tab => (
          <Tab.Panel key={tab}>{tab} panel</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
  const tabs = screen.getAllByRole('tab');
  expect(tabs.map(tab => tab.textContent)).toEqual(markingTabs);
  expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByText(`${markingTabs[0]} panel`)).toBeInTheDocument();
});
