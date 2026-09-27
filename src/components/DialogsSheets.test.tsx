import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StyledDialog from './StyledDialog';
import Drawer from './Drawer';
import BottomSheet from './BottomSheet';
import ConfirmDeleteDialog from '../dialogs/ConfirmDeleteDialog';

// CAD-87: dialogs and sheets look like M3 and keep their behavior.

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

test('StyledDialog is an M3 basic dialog that still closes on escape and its close button', () => {
  const onClose = vi.fn<() => void>();
  render(
    <StyledDialog
      open
      onCloseDialog={onClose}
      title="Rename"
      fullscreen={false}
    >
      <input aria-label="Name" />
    </StyledDialog>
  );
  const dialog = screen.getByRole('dialog');
  const heading = screen.getByRole('heading', { name: 'Rename' });
  expect(heading.firstElementChild).toHaveClass(
    'text-headline-small',
    'pr-16',
    'whitespace-pre-wrap'
  );
  const panel = heading.parentElement!;
  expect(panel).toHaveClass(
    'bg-surface-container-high',
    'rounded-extra-large',
    'my-8'
  );
  expect(dialog.querySelector('.bg-scrim\\/32')).toBeInTheDocument();

  fireEvent.keyDown(dialog, { key: 'Escape' });
  expect(onClose).toHaveBeenCalledTimes(1);
  userEvent.click(screen.getAllByRole('button')[0]);
  expect(onClose).toHaveBeenCalledTimes(2);
});

test('StyledDialog without a close button leaves the title its full width', () => {
  render(
    <StyledDialog
      open
      onCloseDialog={() => {}}
      title="Search"
      showClose={false}
    >
      body
    </StyledDialog>
  );
  expect(
    screen.getByRole('heading', { name: 'Search' }).firstElementChild
  ).not.toHaveClass('pr-16');
});

test('ConfirmDeleteDialog keeps Cancel then Yes, delete, with delete in the error role', () => {
  const onCancel = vi.fn<() => void>();
  const onConfirm = vi.fn<() => void>();
  render(
    <ConfirmDeleteDialog
      show
      onCloseDialog={() => {}}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
  const buttons = screen
    .getAllByRole('button')
    .filter(b => /Cancel|Yes, delete/.test(b.textContent ?? ''));
  expect(buttons.map(b => b.textContent)).toEqual(['Cancel', 'Yes, delete']);
  expect(buttons[1]).toHaveClass('bg-error', 'text-on-error');
  userEvent.click(buttons[0]);
  expect(onCancel).toHaveBeenCalledTimes(1);
  userEvent.click(buttons[1]);
  expect(onConfirm).toHaveBeenCalledTimes(1);
});

test('Drawer is an M3 side sheet whose scrim closes it', () => {
  const onClose = vi.fn<() => void>();
  const { container, rerender } = render(
    <Drawer open onClose={onClose}>
      menu
    </Drawer>
  );
  const [scrim, sheet] = Array.from(container.children);
  expect(scrim).toHaveClass('visible', 'bg-scrim/32');
  expect(sheet).toHaveClass('bg-surface-container-low', 'translate-x-0');
  userEvent.click(scrim);
  expect(onClose).toHaveBeenCalledTimes(1);

  rerender(
    <Drawer open={false} onClose={onClose}>
      menu
    </Drawer>
  );
  expect(scrim).toHaveClass('hidden');
  expect(sheet).toHaveClass('translate-x-56');
});

test('BottomSheet slides by its open prop and closes from its button', () => {
  const onClose = vi.fn<() => void>();
  const { container, rerender } = render(
    <BottomSheet open onClose={onClose}>
      sheet
    </BottomSheet>
  );
  expect(container.firstElementChild).toHaveClass('bottom-0');
  userEvent.click(screen.getByRole('button'));
  expect(onClose).toHaveBeenCalledTimes(1);
  rerender(<BottomSheet open={false}>sheet</BottomSheet>);
  expect(container.firstElementChild).toHaveClass('-bottom-full');
});

test('StyledDialog still closes when its backdrop is clicked', () => {
  const onClose = vi.fn<() => void>();
  const { baseElement } = render(
    <StyledDialog open onCloseDialog={onClose} title="Rename">
      body
    </StyledDialog>
  );
  userEvent.click(baseElement.querySelector('.bg-scrim\\/32')!);
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('ConfirmDeleteDialog disables "Yes, delete" while it deletes', () => {
  const onConfirm = vi.fn<() => void>();
  render(
    <ConfirmDeleteDialog
      show
      onCloseDialog={() => {}}
      onCancel={() => {}}
      onConfirm={onConfirm}
    />
  );
  const confirm = screen.getByRole('button', { name: 'Yes, delete' });
  userEvent.click(confirm);
  expect(onConfirm).toHaveBeenCalledTimes(1);
  // Loading: the label is replaced by a spinner and the button is disabled,
  // keeping the error color
  const loading = screen
    .getAllByRole('button')
    .find(b => b.classList.contains('bg-error'))!;
  expect(loading).toBeDisabled();
  expect(loading).not.toHaveTextContent('Yes, delete');
  userEvent.click(loading);
  expect(onConfirm).toHaveBeenCalledTimes(1);
});
