import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FocusEventHandler, MouseEventHandler } from 'react';
import OutlinedInput from './OutlinedInput';
import WellInput from './WellInput';
import TimeInput from './TimeInput';
import SearchBar from '../SearchBar';

vi.mock('../SearchDialog', () => ({
  default: ({ open }: { open: boolean }) => (open ? <div>dialog</div> : null),
}));

// CAD-85: the M3 text fields keep their behavior.

describe('OutlinedInput', () => {
  test('its label names the input, and floats while focused or filled', () => {
    const onFocus = vi.fn<FocusEventHandler<HTMLInputElement>>();
    const onBlur = vi.fn<FocusEventHandler<HTMLInputElement>>();
    render(
      <OutlinedInput
        label="Name"
        onChange={() => {}}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    );
    const input = screen.getByLabelText('Name');
    const label = screen.getByText('Name', { selector: 'label' });
    expect(label).toHaveClass('translate-y-3');

    fireEvent.focus(input);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(label).toHaveClass('scale-75', 'text-primary');

    // Uncontrolled: what's typed keeps it floated after blur
    fireEvent.change(input, { target: { value: 'Andrew' } });
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(label).toHaveClass('scale-75', 'text-on-surface-variant');
  });

  test('a placeholder or a date type keeps the label floated', () => {
    render(
      <>
        <OutlinedInput
          label="Title"
          placeholder="Song title"
          onChange={() => {}}
        />
        <OutlinedInput label="Date" type="date" value="" onChange={() => {}} />
      </>
    );
    expect(screen.getByPlaceholderText('Song title')).toBeInTheDocument();
    expect(screen.getByText('Title', { selector: 'label' })).toHaveClass(
      'scale-75'
    );
    expect(screen.getByText('Date', { selector: 'label' })).toHaveClass(
      'scale-75'
    );
  });

  test('className goes on the field, and an id passed in is kept', () => {
    const { container } = render(
      <OutlinedInput id="email" className="mb-4" onChange={() => {}} />
    );
    const input = container.querySelector('input')!;
    expect(input).toHaveAttribute('id', 'email');
    expect(input).not.toHaveClass('mb-4');
    expect(input.parentElement).toHaveClass('mb-4');
  });

  test('supporting text describes the input; an error replaces it', () => {
    const { rerender } = render(
      <OutlinedInput
        label="Email"
        onChange={() => {}}
        supportingText="We'll send the invite here"
      />
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAccessibleDescription("We'll send the invite here");
    expect(input).not.toHaveAttribute('aria-invalid');

    rerender(
      <OutlinedInput
        label="Email"
        onChange={() => {}}
        supportingText="We'll send the invite here"
        error="Enter an email"
      />
    );
    expect(input).toHaveAccessibleDescription('Enter an email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Enter an email')).toHaveClass('text-error');
  });

  test('the trailing button is not clickable while loading', () => {
    const onButtonClick = vi.fn<MouseEventHandler<HTMLButtonElement>>();
    const { rerender } = render(
      <OutlinedInput
        onChange={() => {}}
        button="Create"
        onButtonClick={onButtonClick}
      />
    );
    userEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(onButtonClick).toHaveBeenCalledTimes(1);

    rerender(
      <OutlinedInput
        onChange={() => {}}
        button="Create"
        onButtonClick={onButtonClick}
        buttonLoading
      />
    );
    userEvent.click(screen.getByRole('button'));
    expect(onButtonClick).toHaveBeenCalledTimes(1);
  });
});

test('WellInput is a filled field and keeps its className and placeholder', () => {
  render(<WellInput onChange={() => {}} className="mb-4" />);
  const input = screen.getByPlaceholderText('Search');
  expect(input).toHaveClass('bg-surface-container-highest', 'mb-4');
});

test('TimeInput shows focus on its outline', () => {
  const { container } = render(<TimeInput defaultValue="7:30 PM" />);
  const [hour] = screen.getAllByPlaceholderText('00');
  const field = container.firstElementChild!;
  expect(field).toHaveClass('border-outline');
  fireEvent.focus(hour);
  expect(field).toHaveClass('border-primary');
  expect(field.className).not.toContain('undefined');
});

test('SearchBar opens the search dialog', () => {
  render(<SearchBar />);
  expect(screen.queryByText('dialog')).not.toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: 'Search library' }));
  expect(screen.getByText('dialog')).toBeInTheDocument();
});
