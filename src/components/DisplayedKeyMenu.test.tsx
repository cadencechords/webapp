import { fireEvent, render, screen } from '@testing-library/react';
import DisplayedKeyMenu from './DisplayedKeyMenu';

const options = [
  { value: 'original', display: 'Original (A)' },
  { value: 'capo', display: 'Capo 2 (G)' },
  { value: 'none', display: 'Hide chords' },
];

test('DisplayedKeyMenu shows the current key and picks another', () => {
  const onChange = vi.fn<(value: string) => void>();
  render(
    <DisplayedKeyMenu options={options} selected="capo" onChange={onChange} />
  );
  const button = screen.getByRole('button', { name: 'Key: Capo 2 (G)' });
  expect(button).toHaveClass('rounded-[20px]', 'bg-surface-container-highest');
  expect(button).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(button);
  expect(button).toHaveAttribute('aria-expanded', 'true');
  const selected = screen.getByRole('button', { name: 'Capo 2 (G)' });
  expect(selected).toHaveClass('bg-tertiary-container');
  // Only the current key has a check.
  expect(selected.querySelectorAll('svg')).toHaveLength(1);
  expect(
    screen.getByRole('button', { name: 'Hide chords' }).querySelector('svg')
  ).toBeNull();

  fireEvent.click(screen.getByRole('button', { name: 'Hide chords' }));
  expect(onChange).toHaveBeenCalledWith('none');
});

test('DisplayedKeyMenu shows no key until one is selected', () => {
  render(<DisplayedKeyMenu options={options} onChange={() => {}} />);
  expect(screen.getByRole('button', { name: 'Key:' })).toBeInTheDocument();
});
