import { Tab } from '@headlessui/react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import MarkingTabs from './MarkingTabs';
import { PrimaryTab, PrimaryTabs } from './tabs/PrimaryTabs';
import { markingTabs } from '../utils/constants';

afterEach(() => {
  vi.restoreAllMocks();
});

// jsdom has no layout: give each label a box from its text, 100px apart.
function stubLayout() {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: HTMLElement) {
      const labels = ['Details', 'Reminders', 'Set'];
      const index = this.hasAttribute('data-tab-label')
        ? labels.indexOf(this.textContent ?? '')
        : -1;
      const left = index >= 0 ? 16 + index * 100 : 0;
      const width = index >= 0 ? (this.textContent ?? '').length * 8 : 400;
      return {
        left,
        width,
        top: 0,
        height: 20,
        right: left + width,
        bottom: 20,
        x: left,
        y: 0,
        toJSON: () => ({}),
      };
    }
  );
}

function EventTabs({ onChange }: { onChange?: (index: number) => void }) {
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
  render(<EventTabs />);
  const tabs = screen.getAllByRole('tab');
  expect(tabs.map(tab => tab.textContent)).toEqual([
    'Details',
    'Reminders',
    'Set',
  ]);
  expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  expect(tabs[0]).toHaveClass('text-primary', 'text-title-small', 'h-12');
  expect(tabs[1]).toHaveClass('text-on-surface-variant', 'state-layer-flat');
  expect(screen.getByRole('tablist')).toHaveClass('border-outline-variant');
});

test('arrow keys still move between tabs and show their panels', () => {
  const onChange = vi.fn<(index: number) => void>();
  render(<EventTabs onChange={onChange} />);
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

test('the indicator sits under the selected label, as wide as it, and slides after the first placement', () => {
  stubLayout();
  const frames: FrameRequestCallback[] = [];
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    frames.push(callback);
    return frames.length;
  });
  const { container } = render(<EventTabs />);
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
