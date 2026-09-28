import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createRef,
  type FocusEventHandler,
  type MouseEventHandler,
} from 'react';
import OutlinedInput from './OutlinedInput';
import WellInput from './WellInput';
import TimeInput from './TimeInput';
import SearchField from './SearchField';

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

test('TimeInput shows focus on its outline, with its label in the notch', () => {
  const { container } = render(
    <TimeInput defaultValue="7:30 PM" label="Start time" />
  );
  const hour = screen.getByRole('textbox', { name: 'Start time hour' });
  const outline = container.querySelector('fieldset')!;
  expect(outline).toHaveClass('border-outline');
  expect(outline.querySelector('legend')).toHaveTextContent('Start time');
  fireEvent.focus(hour);
  expect(outline).toHaveClass('border-2', 'border-primary');
  expect(container.firstElementChild!.className).not.toContain('undefined');
});

test('SearchField is a search box that clears', () => {
  const onChange = vi.fn<(value: string) => void>();
  const { rerender } = render(
    <SearchField placeholder="Search your songs" value="" onChange={onChange} />
  );
  const box = screen.getByRole('searchbox', { name: 'Search your songs' });
  // No clear button while empty.
  expect(
    screen.queryByRole('button', { name: 'Clear search' })
  ).not.toBeInTheDocument();

  fireEvent.change(box, { target: { value: 'grace' } });
  expect(onChange).toHaveBeenLastCalledWith('grace');

  rerender(
    <SearchField
      placeholder="Search your songs"
      value="grace"
      onChange={onChange}
    />
  );
  userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
  expect(onChange).toHaveBeenLastCalledWith('');
  expect(box).toHaveFocus();
});

test('OutlinedInput forwards its ref to the input, and an empty error is no error', () => {
  const ref = createRef<HTMLInputElement>();
  render(<OutlinedInput ref={ref} label="Name" error="" onChange={() => {}} />);
  const input = screen.getByLabelText('Name');
  expect(ref.current).toBe(input);
  ref.current!.focus();
  expect(input).toHaveFocus();
  expect(input).not.toHaveAttribute('aria-invalid');
});

test('OutlinedInput always has a legend, so the outline lines up with or without a label', () => {
  const { container } = render(
    <>
      <OutlinedInput onChange={() => {}} />
      <OutlinedInput label="Name" onChange={() => {}} />
    </>
  );
  const [unlabeled, labeled] = container.querySelectorAll('fieldset');
  expect(unlabeled.querySelector('legend')).toHaveClass('max-w-[0.01px]');
  expect(unlabeled.querySelector('legend')).toBeEmptyDOMElement();
  expect(labeled.querySelector('legend')).toHaveTextContent('Name');
});
