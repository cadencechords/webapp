import { fireEvent, render, screen, within } from '@testing-library/react';
import DialogActions from './DialogActions';
import Button from './Button';
import StyledDialog from './StyledDialog';
import AddCancelActions from './buttons/AddCancelActions';

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
  // Sticky, and in a panel that doesn't scroll itself, so it stays in reach.
  expect(header).toHaveClass('sticky', 'top-0');
  expect(header.parentElement).not.toHaveClass('overflow-y-auto');

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

test('the header keeps a close button when the dialog hides its own', () => {
  stubWidth(false);
  const onClose = vi.fn<() => void>();
  render(
    <StyledDialog
      open
      onCloseDialog={onClose}
      title="Pick"
      showClose={false}
      hideTitle
    >
      <DialogActions onCancel={onClose} primary={<Button>Add</Button>} />
    </StyledDialog>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(onClose).toHaveBeenCalled();
});

test('AddCancelActions moves its Add button to the header on a phone', () => {
  stubWidth(false);
  const onAdd = vi.fn<() => void>();
  render(
    <StyledDialog open onCloseDialog={() => {}} title="Add genres">
      <AddCancelActions onAdd={onAdd} addText="Add 2 genres" />
    </StyledDialog>
  );
  const header = screen.getByRole('heading', { name: 'Add genres' })
    .parentElement as HTMLElement;
  fireEvent.click(within(header).getByRole('button', { name: 'Add 2 genres' }));
  expect(onAdd).toHaveBeenCalled();
  expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
});
