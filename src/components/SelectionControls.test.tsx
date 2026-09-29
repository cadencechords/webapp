import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import Checkbox from './Checkbox';
import Toggle from './Toggle';
import Range from './Range';
import Select from './Select';
import StyledListBox from './StyledListBox';

// CAD-86: the M3 selection controls keep their behavior.

test('Checkbox shows the check only when checked, in the on-color', () => {
  const { container, rerender } = render(
    <Checkbox checked={false} onChange={() => {}} />
  );
  const check = () => container.querySelector('svg')!;
  expect(check()).toHaveClass('scale-0');
  expect(screen.getByRole('button')).toHaveClass('text-on-surface-variant');

  rerender(<Checkbox checked onChange={() => {}} color="green" />);
  expect(check()).toHaveClass('scale-100', 'text-on-user-green');
  expect(screen.getByRole('button')).toHaveClass('text-user-green');
});

// jsdom doesn't hit-test, so this pins the structure that makes the input
// take clicks in a browser: first in a wrapper that isolates it, covering
// the button with z-[1], and nothing in the button positioned above it. (A
// regression here broke clicks inside <label> rows and doubled row clicks;
// see CAD-86's review.)
test('Checkbox keeps its invisible input first and on top of the box', () => {
  const { container } = render(
    <Checkbox checked onChange={() => {}} className="mr-4" />
  );
  const wrapper = container.firstElementChild!;
  expect(wrapper).toHaveClass('relative', 'isolate', 'mr-4');
  const [input, button] = Array.from(wrapper.children);
  expect(input.tagName).toBe('INPUT');
  expect(button.tagName).toBe('BUTTON');
  expect(input).toHaveClass('absolute', 'inset-0', 'z-[1]', 'opacity-0');
  for (const element of [button, ...button.querySelectorAll('*')]) {
    expect(element.className.toString()).not.toMatch(
      /(^|\s)(relative|absolute|fixed|sticky|z-\S+|before:\S+)(\s|$)/
    );
  }
});

test('Checkbox in a label row toggles once from a click on its input', () => {
  const onChange = vi.fn<ComponentProps<typeof Checkbox>['onChange']>();
  const onRow = vi.fn<() => void>();
  const { container } = render(
    <label onClick={onRow}>
      <Checkbox checked={false} onChange={onChange} standAlone={false} />
      Song
    </label>
  );
  userEvent.click(container.querySelector('input')!);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(true);
  expect(onRow).toHaveBeenCalledTimes(1);

  // The label's text forwards to the input, its first labelable element
  userEvent.click(screen.getByText('Song'));
  expect(onChange).toHaveBeenCalledTimes(2);
});

test('Toggle switches with the keyboard and its thumb grows when on', () => {
  const onChange = vi.fn<(enabled: boolean) => void>();
  const { rerender } = render(
    <Toggle enabled={false} onChange={onChange} label="Dark theme" />
  );
  const toggle = screen.getByRole('switch', { name: 'Dark theme' });
  expect(toggle).toHaveAttribute('aria-checked', 'false');
  expect(toggle.firstElementChild).toHaveClass('w-3.5', 'bg-outline');
  toggle.focus();
  fireEvent.keyUp(toggle, { key: ' ' });
  expect(onChange).toHaveBeenCalledWith(true);

  rerender(<Toggle enabled onChange={onChange} label="Dark theme" />);
  expect(toggle).toHaveAttribute('aria-checked', 'true');
  expect(toggle.firstElementChild).toHaveClass('w-5', 'bg-current');
});

test('Range paints the track from where its value is, and shows the value', () => {
  const { container, rerender } = render(
    <Range min={1} max={10} value={1} onChange={() => {}} />
  );
  const wrapper = container.firstElementChild as HTMLElement;
  expect(wrapper.style.getPropertyValue('--value')).toBe('0');
  expect(screen.getByText('1')).toHaveAttribute('aria-hidden', 'true');

  rerender(<Range min={1} max={10} value={10} onChange={() => {}} />);
  expect(wrapper.style.getPropertyValue('--value')).toBe('1');

  // Out of range values are clamped
  rerender(<Range min={1} max={10} value={20} onChange={() => {}} />);
  expect(wrapper.style.getPropertyValue('--value')).toBe('1');
});

test('an uncontrolled Range starts halfway and its track follows the handle', () => {
  const onChange = vi.fn<(value: number) => void>();
  const { container } = render(<Range onChange={onChange} />);
  const wrapper = container.firstElementChild as HTMLElement;
  expect(wrapper.style.getPropertyValue('--value')).toBe('0.5');
  fireEvent.change(screen.getByRole('slider'), { target: { value: '80' } });
  expect(onChange).toHaveBeenCalledWith(80);
  expect(wrapper.style.getPropertyValue('--value')).toBe('0.8');
  expect(screen.getByText('80')).toHaveAttribute('aria-hidden', 'true');
});

test('Select is still a native select that reports its value', () => {
  const onChange = vi.fn<(value: string) => void>();
  const { container } = render(
    <Select
      options={[
        { value: 'a', display: 'A' },
        { value: 'b', display: 'B' },
      ]}
      selected="a"
      onChange={onChange}
    />
  );
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'b' } });
  expect(onChange).toHaveBeenCalledWith('b');
  // The arrow doesn't swallow clicks meant for the select
  expect(container.querySelector('svg')).toHaveClass('pointer-events-none');
});

test('StyledListBox opens a menu, marks the selected option and reports a pick', () => {
  const onChange = vi.fn<(value: number) => void>();
  const options = [
    { value: 1, template: 'One' },
    { value: 2, template: 'Two' },
  ];
  render(
    <StyledListBox
      options={options}
      selectedOption={options[0]}
      onChange={onChange}
    />
  );
  userEvent.click(screen.getByRole('button'));
  expect(screen.getByRole('listbox')).toHaveClass('bg-surface-container');
  expect(screen.getByRole('option', { name: 'One' })).toHaveClass(
    'bg-secondary-container'
  );
  userEvent.click(screen.getByRole('option', { name: 'Two' }));
  expect(onChange).toHaveBeenCalledWith(2);
});
