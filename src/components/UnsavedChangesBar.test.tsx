import { fireEvent, render, screen } from '@testing-library/react';
import UnsavedChangesBar from './UnsavedChangesBar';

test('UnsavedChangesBar saves the edits', () => {
  const onSave = vi.fn<() => void>();
  render(
    <UnsavedChangesBar
      changes={{ name: 'A' }}
      isSaving={false}
      onSave={onSave}
    />
  );
  const bar = screen.getByRole('status');
  expect(bar).toHaveTextContent('You have unsaved changes');
  expect(bar).toHaveClass('rounded-extra-large', 'bg-primary-container');

  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(onSave).toHaveBeenCalledTimes(1);
});

test('UnsavedChangesBar dismisses until the changes change', () => {
  const changes = { name: 'A' };
  const { rerender } = render(
    <UnsavedChangesBar changes={changes} isSaving={false} onSave={() => {}} />
  );
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
  expect(screen.queryByRole('status')).not.toBeInTheDocument();

  // The same edits: still hidden.
  rerender(
    <UnsavedChangesBar changes={changes} isSaving={false} onSave={() => {}} />
  );
  expect(screen.queryByRole('status')).not.toBeInTheDocument();

  // Another edit brings it back.
  rerender(
    <UnsavedChangesBar
      changes={{ name: 'AB' }}
      isSaving={false}
      onSave={() => {}}
    />
  );
  expect(screen.getByRole('status')).toBeInTheDocument();
});
