import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { compile } from '@tailwindcss/node';
import { MemoryRouter } from 'react-router-dom';
import Card from './Card';
import DragAndDropTable from './DragAndDropTable';
import KeyBadge from './KeyBadge';
import List from './List';
import NumberBadge from './NumberBadge';
import ProfilePicture, { monogram } from './ProfilePicture';
import StackedList from './StackedList';
import BinderSongRow from './BinderSongRow';
import { renderWithProvider } from '../utils/test';
import { getNameOrEmail } from '../utils/model';
import type { Song } from '../types';

test.each([
  ['Ada Lovelace', 'AL'],
  ['  ada   lovelace  byron ', 'AL'],
  ['Cadence', 'C'],
  ['grace@example.com', 'G'],
  ['', ''],
  [null, ''],
  [undefined, ''],
])('monogram(%j) is %j', (name, initials) => {
  expect(monogram(name)).toBe(initials);
});

test('getNameOrEmail leaves out a missing last name', () => {
  expect(getNameOrEmail({ first_name: 'Ada', email: 'a@example.com' })).toBe(
    'Ada'
  );
  expect(getNameOrEmail({ email: 'a@example.com' })).toBe('a@example.com');
});

describe('ProfilePicture', () => {
  test('shows the picture in a circle', () => {
    const { container } = render(
      <ProfilePicture url="https://example.com/me.png" name="Ada Lovelace" />
    );
    const picture = container.querySelector('.rounded-full') as HTMLElement;
    expect(picture.style.backgroundImage).toContain('me.png');
    expect(screen.queryByText('AL')).not.toBeInTheDocument();
  });

  test('falls back to a monogram on primary-container', () => {
    render(<ProfilePicture name="Ada Lovelace" size="xs" />);
    const avatar = screen.getByText('AL');
    expect(avatar).toHaveClass(
      'rounded-full',
      'bg-primary-container',
      'text-on-primary-container'
    );
    expect(avatar).toHaveStyle({ width: '30px', height: '30px' });
  });

  test('falls back to a person icon without a name', () => {
    const { container } = render(<ProfilePicture />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  test('stays clickable', () => {
    const onClick = vi.fn<() => void>();
    render(<ProfilePicture name="Cadence" onClick={onClick} />);
    userEvent.click(screen.getByText('C'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('Card', () => {
  test.each([
    [undefined, 'bg-surface-container-highest'],
    ['filled', 'bg-surface-container-highest'],
    ['elevated', 'shadow-(--md-sys-elevation-level1)'],
    ['outlined', 'border-outline-variant'],
  ] as const)('%s card', (variant, expected) => {
    render(<Card variant={variant}>Body</Card>);
    expect(screen.getByText('Body')).toHaveClass('rounded-medium', expected);
  });

  test('a clickable card gets a state layer', () => {
    const onClick = vi.fn<() => void>();
    render(
      <>
        <Card onClick={onClick}>Clickable</Card>
        <Card>Static</Card>
        <Card interactive>In a link</Card>
      </>
    );
    userEvent.click(screen.getByText('Clickable'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Clickable')).toHaveClass('state-layer-flat');
    expect(screen.getByText('Static')).not.toHaveClass('state-layer-flat');
    expect(screen.getByText('In a link')).toHaveClass('state-layer-flat');
  });
});

test('List groups its rows in a segmented container, or shows ListEmpty', () => {
  const { rerender } = render(
    <List
      data={['a', 'b']}
      className="delay-100"
      renderItem={item => <div key={item}>{item}</div>}
      ListEmpty={<p>Nothing</p>}
    />
  );
  expect(screen.getByText('a').parentElement).toHaveClass(
    'list-segmented',
    'delay-100'
  );

  rerender(
    <List<string>
      data={[]}
      renderItem={item => <div key={item}>{item}</div>}
      ListEmpty={<p>Nothing</p>}
    />
  );
  expect(screen.getByText('Nothing')).toBeInTheDocument();
});

test('StackedList is segmented too', () => {
  render(<StackedList items={[<span key="1">Song</span>]} />);
  expect(screen.getByText('Song').parentElement?.parentElement).toHaveClass(
    'list-segmented'
  );
});

const songs = [
  { id: 1, name: 'Amazing Grace', original_key: 'G' },
  { id: 2, name: 'Be Thou My Vision', original_key: 'D' },
] as Song[];

describe('DragAndDropTable', () => {
  test('rows keep their links and remove buttons', () => {
    const onRemove = vi.fn<(id: number) => void>();
    render(
      <MemoryRouter>
        <DragAndDropTable items={songs} removeable onRemove={onRemove} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Amazing Grace' })).toHaveAttribute(
      'href',
      '/songs/1'
    );
    const row = screen
      .getByRole('link', { name: 'Be Thou My Vision' })
      .closest('[data-rbd-draggable-id]') as HTMLElement;
    expect(row.parentElement).toHaveClass('list-segmented');
    expect(row).toHaveClass('state-layer-flat', 'min-h-14');
    expect(row).not.toHaveAttribute('data-dragging');

    userEvent.click(row.querySelector('button') as HTMLElement);
    expect(onRemove).toHaveBeenCalledWith(2);
  });

  test('a row being dragged is marked, and dropping reorders', () => {
    const onReorder = vi.fn<(items: Song[]) => void>();
    render(
      <MemoryRouter>
        <DragAndDropTable items={songs} onReorder={onReorder} />
      </MemoryRouter>
    );
    const row = screen
      .getByRole('link', { name: 'Amazing Grace' })
      .closest('[data-rbd-draggable-id]') as HTMLElement;

    // react-beautiful-dnd's keyboard sensor: space lifts, arrows move,
    // space drops.
    row.focus();
    act(() => {
      fireEvent.keyDown(row, { keyCode: 32 });
    });
    expect(row).toHaveAttribute('data-dragging', 'true');

    act(() => {
      fireEvent.keyDown(row, { keyCode: 40 });
    });
    act(() => {
      fireEvent.keyDown(row, { keyCode: 32 });
    });
    expect(onReorder).toHaveBeenCalledWith(
      [songs[1], songs[0]],
      expect.objectContaining({ id: '1', newPosition: 1 })
    );
  });

  test('non-rearrangeable rows are segmented without drag handles', () => {
    const { container } = render(
      <MemoryRouter>
        <DragAndDropTable items={songs} rearrangeable={false} />
      </MemoryRouter>
    );
    expect(container.firstElementChild).toHaveClass('list-segmented');
    expect(container.querySelector('[data-rbd-draggable-id]')).toBeNull();
  });
});

test('BinderSongRow: the link fills the row and takes the focus ring', () => {
  renderWithProvider(
    <MemoryRouter>
      <BinderSongRow song={songs[0]} binderId={5} />
    </MemoryRouter>
  );
  const link = screen.getByRole('link', { name: /Amazing Grace/ });
  // The link, not the row, is 56dp tall and padded, so the whole row but the
  // remove button opens the song.
  expect(link).toHaveClass(
    'flex-1',
    'min-h-14',
    'py-2',
    'focus-visible:outline-3'
  );
  const row = link.parentElement as HTMLElement;
  // One state layer: the link's (a second on the row would stack on hover).
  expect(link).toHaveClass('state-layer-flat');
  expect(row).not.toHaveClass('state-layer-flat');
  expect(row.className).not.toMatch(/\bpy-/);
  expect(row.className).not.toMatch(/min-h-/);
  expect(row.querySelector('button')).not.toBeNull();
});

test('KeyBadge is an outlined chip, and renders nothing without a key', () => {
  const { container, rerender } = render(<KeyBadge songKey="Bb" />);
  expect(screen.getByText('Bb')).toHaveClass(
    'rounded-small',
    'border-outline-variant'
  );
  rerender(<KeyBadge />);
  expect(container).toBeEmptyDOMElement();
});

test('NumberBadge is an M3 badge, muted when disabled', () => {
  render(
    <>
      <NumberBadge className="">3</NumberBadge>
      <NumberBadge className="" disabled>
        4
      </NumberBadge>
    </>
  );
  expect(screen.getByText('3')).toHaveClass('bg-error', 'text-on-error');
  expect(screen.getByText('4')).toHaveClass('text-on-surface/38');
});

describe('list-segmented CSS', () => {
  let css: string;
  beforeAll(async () => {
    const compiler = await compile(readFileSync('src/index.css', 'utf8'), {
      base: path.resolve('src'),
      onDependency: () => {},
    });
    css = compiler.build(['state-layer-flat']);
  });

  test('segments are surface-container, with large corners at the ends', () => {
    const start = css.indexOf('@layer components {\n  .list-segmented');
    expect(start).toBeGreaterThan(-1);
    const block = css.slice(start, css.indexOf('\n}', start));
    expect(block).toMatch(
      /\.list-segmented > \* \{\s*background-color: var\(--md-sys-color-surface-container\)/
    );
    expect(block).toMatch(
      /\.list-segmented > :first-child \{\s*border-top-left-radius: var\(--md-sys-shape-corner-large\)/
    );
    expect(block).toMatch(
      /\.list-segmented > \[data-dragging\] \{[^}]*box-shadow: var\(--md-sys-elevation-level3\)/
    );
  });

  test('segments are spaced by margins, which react-beautiful-dnd measures', () => {
    // The same margin on every segment, so a row's margin box doesn't depend
    // on its position.
    expect(css).toMatch(/\.list-segmented > \* \{[^}]*margin-block: 1px/);
    expect(css).toMatch(/\.list-segmented \{[^}]*margin-block: -1px/);
    expect(css).not.toMatch(/\.list-segmented \{[^}]*gap:/);
  });

  test('the drag placeholder is an empty gap, and the row before it closes the group', () => {
    expect(css).toMatch(
      /\.list-segmented > \[data-rbd-placeholder-context-id\] \{\s*background-color: transparent/
    );
    expect(css).toMatch(
      /\.list-segmented > :has\(\+ \[data-rbd-placeholder-context-id\]:last-child\)/
    );
  });

  test('state-layer-flat shows the 16% dragged layer', () => {
    expect(css).toMatch(
      /&\[data-dragging\] \{\s*--state-layer-opacity: var\(--md-sys-state-dragged-state-layer-opacity\)/
    );
  });
});
