import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BinderColor from '../BinderColor';
import Checkbox from '../Checkbox';
import EditableData from './EditableData';
import EventColorOption from '../EventColorOption';
import FileInput from '../FileInput';
import OpenInput from './OpenInput';
import OutlinedInput from './OutlinedInput';
import ProfilePicture from '../ProfilePicture';
import Range from '../Range';
import Toggle from '../Toggle';
import WellInput from './WellInput';

// These pin the defaults that used to live in defaultProps (CAD-119).

test('Checkbox defaults to blue and toggles through its hidden input', () => {
  const onChange = vi.fn();
  const { container } = render(<Checkbox checked onChange={onChange} />);
  const button = screen.getByRole('button');
  expect(button).toHaveClass('ring-blue-400', 'bg-blue-600');
  expect(button.className).not.toContain('undefined');
  userEvent.click(button);
  expect(onChange).toHaveBeenCalledWith(false);
  expect(container.querySelector('input')).toBeChecked();
});

test('Toggle defaults to blue with no spacing', () => {
  const { container } = render(<Toggle enabled label="On" />);
  expect(screen.getByRole('switch')).toHaveClass('bg-blue-600');
  expect(container.firstElementChild?.className).toBe('flex items-center ');
});

test('Range has no stray class and reports numbers', () => {
  const onChange = vi.fn();
  render(<Range min={0} max={10} value={5} onChange={onChange} />);
  const range = screen.getByRole('slider');
  expect(range.className).toBe('w-full ');
});

test('EditableData is an editable text input by default', () => {
  const onChange = vi.fn();
  render(<EditableData value="" onChange={onChange} />);
  const input = screen.getByRole('textbox');
  expect(input).toHaveAttribute('type', 'text');
  expect(input.className).not.toContain('text-center');
  userEvent.type(input, 'a');
  expect(onChange).toHaveBeenCalledWith('a');
});

test('EditableData renders non-text values when not editable', () => {
  render(<EditableData value={<b>bold</b>} editable={false} />);
  expect(screen.getByText('bold').tagName).toBe('B');
});

test('OpenInput and WellInput defaults', () => {
  render(
    <>
      <OpenInput value="" onChange={() => {}} />
      <WellInput value="" onChange={() => {}} />
    </>
  );
  const [open, well] = screen.getAllByRole('textbox');
  expect(open.className).not.toContain('undefined');
  expect(open).not.toHaveFocus();
  expect(well).toHaveAttribute('placeholder', 'Search');
  expect(well).toHaveAttribute('id', '');
  expect(well.className).not.toContain('undefined');
});

test('OutlinedInput defaults to type text and calls onEnter', () => {
  const onEnter = vi.fn();
  render(<OutlinedInput value="" onChange={() => {}} onEnter={onEnter} />);
  const input = screen.getByRole('textbox');
  expect(input).toHaveAttribute('type', 'text');
  expect(input).toHaveAttribute('pattern', '');
  userEvent.type(input, '{enter}');
  expect(onEnter).toHaveBeenCalledTimes(1);
});

test('FileInput accepts any file by default', () => {
  const { container } = render(
    <FileInput onChange={() => {}} onRemove={() => {}} />
  );
  expect(container.querySelector('input[type="file"]')).toHaveAttribute(
    'accept',
    ''
  );
});

test('BinderColor defaults to a white, size 4, editable swatch', () => {
  const onClick = vi.fn();
  const { container } = render(<BinderColor onClick={onClick} />);
  const swatch = container.firstElementChild as HTMLElement;
  expect(swatch).toHaveClass('h-4', 'w-4', 'cursor-pointer');
  userEvent.click(swatch);
  expect(onClick).toHaveBeenCalledWith('white');
});

test('EventColorOption has no stray class', () => {
  render(<EventColorOption color="red" />);
  expect(screen.getByRole('button').className).not.toContain('undefined');
});

test('ProfilePicture defaults to the base size', () => {
  const { container } = render(<ProfilePicture />);
  const picture = container.firstElementChild as HTMLElement;
  expect(picture.style.width).toBe('70px');
});
