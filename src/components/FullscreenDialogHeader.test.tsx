import { fireEvent, render, screen, within } from '@testing-library/react';
import DialogActions from './DialogActions';
import Button from './Button';
import StyledDialog from './StyledDialog';

// headlessui's Dialog can use ResizeObserver, which jsdom doesn't have.
beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
});

function stubWidth(isSm: boolean) {
  vi.stubGlobal('matchMedia', () => ({
    matches: isSm,
    addEventListener() {},
    removeEventListener() {},
  }));
}

function renderDialog(fullscreen = true) {
  const onClose = vi.fn<() => void>();
  const onSave = vi.fn<() => void>();
  const onDelete = vi.fn<() => void>();
  render(
    <StyledDialog
      open
      onCloseDialog={onClose}
      title="New thing"
      fullscreen={fullscreen}
    >
      <p>Body</p>
      <DialogActions
        onCancel={onClose}
        start={
          <Button variant="open" size="sm" onClick={onDelete}>
            Delete
          </Button>
        }
        primary={
          <Button variant="open" size="sm" onClick={onSave}>
            Save
          </Button>
        }
      />
    </StyledDialog>
  );
  return { onClose, onSave, onDelete };
}

test('a full-screen dialog on a phone puts close and save in its header', () => {
  stubWidth(false);
  const { onClose, onSave } = renderDialog();

  const header = screen.getByRole('heading', { name: 'New thing' })
    .parentElement as HTMLElement;
  const buttons = within(header).getAllByRole('button');
  expect(buttons.map(button => button.textContent)).toEqual(['', 'Save']);
  expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();

  fireEvent.click(within(header).getByRole('button', { name: 'Close' }));
  expect(onClose).toHaveBeenCalled();
  fireEvent.click(within(header).getByRole('button', { name: 'Save' }));
  expect(onSave).toHaveBeenCalled();
});

test('on a phone, an action for the start stays at the bottom', () => {
  stubWidth(false);
  const { onDelete } = renderDialog();
  fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
  expect(onDelete).toHaveBeenCalled();
});

test.each([
  ['from sm up', true, true],
  ['in a dialog that isn’t full-screen', false, false],
])('%s, Cancel and Save stay at the bottom', (_, isSm, fullscreen) => {
  stubWidth(isSm);
  renderDialog(fullscreen);
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
});
