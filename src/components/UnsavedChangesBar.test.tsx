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
  // Above the song's chords (z-10).
  expect(bar).toHaveClass('z-20');

  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(onSave).toHaveBeenCalledTimes(1);
});

test('UnsavedChangesBar can be dismissed without saving', () => {
  const onSave = vi.fn<() => void>();
  render(<UnsavedChangesBar isSaving={false} onSave={onSave} />);
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(onSave).not.toHaveBeenCalled();
});
