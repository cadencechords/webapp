import { fireEvent, render, screen } from '@testing-library/react';
import UnsavedChangesBar from './UnsavedChangesBar';

test('UnsavedChangesBar saves the edits', () => {
  const onSave = vi.fn<() => void>();
  render(<UnsavedChangesBar isSaving={false} onSave={onSave} />);
  const bar = screen.getByRole('status');
  expect(bar).toHaveTextContent('You have unsaved changes');
  expect(bar).toHaveClass(
    'rounded-extra-large',
    'bg-primary-container',
    'sticky'
  );
  // The only save control: nothing hides it while there are edits.
  expect(
    screen.queryByRole('button', { name: 'Dismiss' })
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(onSave).toHaveBeenCalledTimes(1);
});
