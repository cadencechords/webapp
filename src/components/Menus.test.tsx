import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProvider } from '../utils/test';
import { DELETE_FILES, DELETE_SETLISTS, EDIT_FILES } from '../utils/constants';
import { MenuDivider, MenuItem, MenuList } from './Menu';
import StyledPopover, { transformOrigin } from './StyledPopover';
import SongFileOptionsPopover from './SongFileOptionsPopover';
import SetlistOptionsPopover from './SetlistOptionsPopover';
import MarkingOptionsPopover from './MarkingOptionsPopover';
import MobileProfilePictureMenu from './mobile menus/MobileProfilePictureMenu';
import type { Setlist, SongFile } from '../types';

// Headless UI's Dialog measures itself with ResizeObserver, which jsdom lacks.
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

const memberWith = (...permissions: string[]) => ({
  auth: {
    currentUser: {
      id: 1,
      role: { permissions: permissions.map(name => ({ name })) },
    },
  },
});

test.each([
  ['bottom-start', 'left top'],
  ['bottom-end', 'right top'],
  ['bottom', 'center top'],
  ['top-start', 'left bottom'],
  ['top', 'center bottom'],
  ['left', 'right center'],
  ['right-start', 'left top'],
  [undefined, 'center top'],
] as const)('a menu placed %s grows from %s', (placement, origin) => {
  expect(transformOrigin(placement)).toBe(origin);
});

test('StyledPopover opens an M3 menu surface and closes from its button', async () => {
  render(
    <>
      <StyledPopover button="Open" position="bottom-start" className="w-60">
        <MenuList>
          <MenuItem>Print</MenuItem>
        </MenuList>
      </StyledPopover>
    </>
  );
  userEvent.click(screen.getByRole('button', { name: 'Open' }));

  const panel = screen.getByText('Print').closest('[id^=headlessui-popover]');
  expect(panel).toHaveClass(
    'bg-surface-container-high',
    'rounded-large',
    'shadow-(--md-sys-elevation-level1)',
    'z-50',
    'w-60'
  );
  expect(panel).toHaveStyle({ position: 'fixed', transformOrigin: 'left top' });
  // Scales and fades in...
  expect(panel).toHaveClass('transition-menu-enter');
  // ...while popper places it with top/left: a transform would be scaled
  // along with the menu, sliding it in from the viewport's corner. (Popper
  // places it after a microtask; data-popper-placement marks that.)
  await waitFor(() => expect(panel).toHaveAttribute('data-popper-placement'));
  expect((panel as HTMLElement).style.transform).toBe('');

  userEvent.click(screen.getByRole('button', { name: 'Open' }));
  await waitFor(() =>
    expect(screen.queryByText('Print')).not.toBeInTheDocument()
  );
});

test('MenuItem is a button, a router link or an external link', () => {
  render(
    <MemoryRouter>
      <MenuItem>Print</MenuItem>
      <MenuItem to="/account">Account</MenuItem>
      <MenuItem href="https://example.com/track">Listen</MenuItem>
    </MemoryRouter>
  );
  expect(screen.getByRole('button', { name: 'Print' })).toHaveAttribute(
    'type',
    'button'
  );
  expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute(
    'href',
    '/account'
  );
  const external = screen.getByRole('link', { name: 'Listen' });
  expect(external).toHaveAttribute('href', 'https://example.com/track');
  expect(external).toHaveAttribute('target', '_blank');
  expect(external).toHaveAttribute('rel', 'noreferrer');
  // No button inside a link: one tab stop per item.
  expect(within(external).queryByRole('button')).not.toBeInTheDocument();
});

test('MenuItem colors: on-surface, error when destructive, 38% when disabled', () => {
  const onClick = vi.fn<() => void>();
  render(
    <>
      <MenuItem icon={<svg data-testid="icon" />} trailing="⌘P">
        Print
      </MenuItem>
      <MenuItem destructive>Delete</MenuItem>
      <MenuItem disabled onClick={onClick}>
        Download
      </MenuItem>
    </>
  );
  const print = screen.getByRole('button', { name: /Print/ });
  expect(print).toHaveClass('text-on-surface', 'h-11', 'state-layer-flat');
  expect(screen.getByTestId('icon').parentElement).toHaveClass(
    'text-on-surface-variant'
  );
  expect(within(print).getByText('⌘P')).toBeInTheDocument();

  expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(
    'text-error'
  );

  const download = screen.getByRole('button', { name: 'Download' });
  expect(download).toBeDisabled();
  expect(download).toHaveClass('text-on-surface/38');
  userEvent.click(download);
  expect(onClick).not.toHaveBeenCalled();
});

test('MenuDivider splits a MenuList into separate surfaces, even inside a fragment', () => {
  const { container, rerender } = render(
    <MenuList>
      <MenuItem>Print</MenuItem>
      <>
        <MenuDivider />
        <MenuItem>Delete</MenuItem>
      </>
    </MenuList>
  );
  // The groups sit 2px apart.
  expect(container.querySelector('[data-menu-groups]')).toHaveClass('gap-0.5');
  const groups = container.querySelectorAll('[data-menu-groups] > div');
  expect(groups).toHaveLength(2);
  expect(groups[0]).toHaveTextContent('Print');
  expect(groups[0]).toHaveClass(
    'bg-surface-container-high',
    'rounded-b-extra-small'
  );
  expect(groups[1]).toHaveTextContent('Delete');
  expect(groups[1]).toHaveClass('rounded-t-extra-small');

  // A divider with nothing before it leaves one plain list.
  rerender(
    <MenuList>
      <MenuDivider />
      <MenuItem>Delete</MenuItem>
    </MenuList>
  );
  expect(container.querySelector('[data-menu-groups]')).toBeNull();
  expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
});

test('choosing a menu item closes the menu, a link included', async () => {
  render(
    <MemoryRouter>
      <StyledPopover button="Open">
        <MenuList>
          <MenuItem to="/account">Account</MenuItem>
        </MenuList>
      </StyledPopover>
    </MemoryRouter>
  );
  userEvent.click(screen.getByRole('button', { name: 'Open' }));
  userEvent.click(screen.getByRole('link', { name: 'Account' }));
  await waitFor(() =>
    expect(screen.queryByText('Account')).not.toBeInTheDocument()
  );
});

const file = { id: 1, name: 'chart.pdf', url: 'https://example.com/chart.pdf' };

test('SongFileOptionsPopover keeps its items and order, with Delete in its own group', () => {
  renderWithProvider(
    <SongFileOptionsPopover
      file={file as SongFile}
      onEdit={() => {}}
      onDelete={() => {}}
    />,
    { preloadedState: memberWith(EDIT_FILES, DELETE_FILES) }
  );
  userEvent.click(screen.getAllByRole('button')[0]);

  const menu = screen
    .getByText('Download')
    .closest('[data-menu-groups]') as HTMLElement;
  const items = within(menu).getAllByRole(/button|link/);
  expect(items.map(item => item.textContent)).toEqual([
    'Download',
    'Edit',
    'Delete',
  ]);
  expect(items[0]).toHaveAttribute('href', file.url);
  expect(items[2]).toHaveClass('text-error');
  // Delete is its own group.
  const groups = menu.querySelectorAll(':scope > div');
  expect(groups).toHaveLength(2);
  expect(groups[1]).toHaveTextContent(/^Delete$/);
});

test('SongFileOptionsPopover without delete has no divider', () => {
  renderWithProvider(
    <SongFileOptionsPopover
      file={file as SongFile}
      onEdit={() => {}}
      onDelete={() => {}}
    />,
    { preloadedState: memberWith(EDIT_FILES) }
  );
  userEvent.click(screen.getAllByRole('button')[0]);

  expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  expect(screen.getByText('Download').closest('[data-menu-groups]')).toBeNull();
});

test('SetlistOptionsPopover with no songs shows only Delete, without a divider', () => {
  renderWithProvider(
    <MemoryRouter>
      <SetlistOptionsPopover
        setlist={{ id: 1, songs: [] } as unknown as Setlist}
        onPerform={() => {}}
      />
    </MemoryRouter>,
    { preloadedState: memberWith(DELETE_SETLISTS) }
  );
  userEvent.click(screen.getAllByRole('button')[0]);

  expect(screen.queryByText('Perform')).not.toBeInTheDocument();
  const remove = screen.getByRole('button', { name: 'Delete' });
  expect(remove.closest('[data-menu-groups]')).toBeNull();
});

test('SetlistOptionsPopover puts Delete in its own group after Perform', () => {
  renderWithProvider(
    <MemoryRouter>
      <SetlistOptionsPopover
        setlist={{ id: 1, songs: [{ id: 2 }] } as unknown as Setlist}
        onPerform={() => {}}
      />
    </MemoryRouter>,
    { preloadedState: memberWith(DELETE_SETLISTS) }
  );
  userEvent.click(screen.getAllByRole('button')[0]);

  const perform = screen.getByRole('button', { name: 'Perform' });
  const remove = screen.getByRole('button', { name: 'Delete' });
  // Separate surfaces, Delete's after Perform's.
  expect(perform.parentElement).not.toBe(remove.parentElement);
  expect(perform.parentElement?.nextElementSibling).toBe(remove.parentElement);
});

test('MarkingOptionsPopover shows its menu while isOpen', async () => {
  const { rerender } = render(
    <MarkingOptionsPopover button="Mark" onDelete={() => {}} isOpen={false} />
  );
  expect(screen.queryByText('Delete')).not.toBeInTheDocument();

  rerender(<MarkingOptionsPopover button="Mark" onDelete={() => {}} isOpen />);
  const remove = screen.getByRole('button', { name: 'Delete' });
  expect(remove).toHaveClass('text-error');
  // Once popper has placed it, it's placed with top/left, not a transform.
  const surface = remove.closest('.bg-surface-container-high') as HTMLElement;
  await waitFor(() => expect(surface).toHaveAttribute('data-popper-placement'));
  expect(surface.style.transform).toBe('');

  rerender(
    <MarkingOptionsPopover button="Mark" onDelete={() => {}} isOpen={false} />
  );
  await waitFor(() =>
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  );
});

test('MobileProfilePictureMenu items run their actions', () => {
  const onOpenFileDialog = vi.fn<() => void>();
  const onDeleteImage = vi.fn<() => void>();
  const onCloseDialog = vi.fn<() => void>();
  render(
    <MobileProfilePictureMenu
      open
      onCloseDialog={onCloseDialog}
      onOpenFileDialog={onOpenFileDialog}
      onDeleteImage={onDeleteImage}
    />
  );

  userEvent.click(screen.getByRole('button', { name: 'Upload from device' }));
  expect(onOpenFileDialog).toHaveBeenCalledTimes(1);

  const remove = screen.getByRole('button', { name: 'Remove photo' });
  expect(remove).toHaveClass('text-error');
  userEvent.click(remove);
  expect(onDeleteImage).toHaveBeenCalledTimes(1);
  expect(onCloseDialog).toHaveBeenCalled();
});
