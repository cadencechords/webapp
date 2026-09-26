import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';
import { renderWithProvider } from '../utils/test';
import { Crescendo, Decrescendo, NarrowArrow } from '../icons/markings';
import ConfirmDeleteDialog from '../dialogs/ConfirmDeleteDialog';
import DetailSection from './DetailSection';
import IconButton from './buttons/IconButton';
import MobileNavLink from './MobileNavLink';
import NotesList from './NotesList';
import TimeInput from './inputs/TimeInput';
import TrackSourceButton from './TrackSourceButton';
import LoginPage from '../pages/LoginPage';
import { toPdf } from '../utils/PdfUtils';
import { buildChromaticScale, semitonesAway } from '../utils/music';
import { determineCapoNumber } from '../utils/capo';
import type { Song } from '../types';

// Pins the behavior of the files converted in CAD-126.

test('marking icons render their clip-path', () => {
  const { container } = render(
    <>
      <NarrowArrow />
      <Crescendo />
      <Decrescendo />
    </>
  );
  const clipPaths = [...container.querySelectorAll('g')].map(g =>
    g.getAttribute('clip-path')
  );
  expect(clipPaths).toEqual([
    'url(#clip0_2_3)',
    'url(#clip0_5_19)',
    'url(#clip0_5_51)',
  ]);
});

test('NotesList renders one note per song note, with no wrapper', () => {
  const song = {
    id: 1,
    name: 'Song',
    format: {},
    notes: [
      { id: 1, content: 'one', color: 'yellow', line_number: 0 },
      { id: 2, content: 'two', color: 'yellow', line_number: 1 },
    ],
  } as Song;
  const { container } = render(<NotesList song={song} onDelete={() => {}} />);
  expect(screen.getAllByPlaceholderText('Type here')).toHaveLength(2);
  expect(container.childElementCount).toBe(2);
});

test('TimeInput parses its default value and reports typed times', () => {
  const onChange = vi.fn();
  render(<TimeInput defaultValue="7:30 PM" onChange={onChange} />);
  const [hour, minute] = screen.getAllByPlaceholderText('00');
  expect(hour).toHaveValue('7');
  expect(minute).toHaveValue('30');

  fireEvent.change(hour, { target: { value: '9' } });
  expect(hour).toHaveValue('9');
  expect(onChange).toHaveBeenLastCalledWith('9:30 PM');

  fireEvent.change(minute, { target: { value: '45' } });
  expect(onChange).toHaveBeenLastCalledWith('9:45 PM');

  fireEvent.click(screen.getByRole('button', { name: 'PM' }));
  expect(onChange).toHaveBeenLastCalledWith('9:45 AM');
});

test('music helpers count semitones from a chromatic scale', () => {
  const scale = buildChromaticScale('C');
  expect(scale.C).toBe(0);
  expect(scale['C#']).toBe(1);
  expect(scale.Db).toBe(1);
  expect(scale.A).toBe(9);
  expect(semitonesAway('C', 'E')).toBe(4);
  expect(semitonesAway('C', 'A', scale)).toBe(9);
  expect(determineCapoNumber('A', 'G')).toBe(2);
});

test('toPdf highlights chords on a chord line', () => {
  const song = {
    id: 1,
    name: 'Song',
    content: 'C  G\nHello',
    format: { bold_chords: true, highlight_color: '#ff0' },
  } as Song;
  const pdf = toPdf(song, true);
  const page = pdf.props.children;
  const body = page.props.children.props.children[1];
  const [chordLine, lyricLine] = body.props.children;

  expect(chordLine.props.style).toEqual({
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    fontWeight: 'bold',
  });
  const tokens = chordLine.props.children as ReactElement[];
  expect(tokens.map(token => token.props.children)).toEqual(['C', '  ', 'G']);
  expect(tokens[0].props.backgroundColor).toBe('#ff0');
  expect(tokens[1].props.backgroundColor).toBeUndefined();
  expect(lyricLine.props.children).toBe('Hello');
});

test('ConfirmDeleteDialog has a default message', () => {
  // headlessui's Dialog can use ResizeObserver, which jsdom doesn't have.
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  render(
    <ConfirmDeleteDialog show onCancel={() => {}} onCloseDialog={() => {}} />
  );
  expect(
    screen.getByText('Deleting this item is irreversible.')
  ).toBeInTheDocument();
  vi.unstubAllGlobals();
});

test('DetailSection shows edit controls only when editable', () => {
  const items = [{ id: 3, name: 'Rock' }];
  const onDelete = vi.fn();
  const { container, rerender } = render(
    <DetailSection title="Genres" items={items} onDelete={onDelete} />
  );
  expect(screen.getByText('Rock')).toBeInTheDocument();
  expect(container.querySelector('svg')).toBeNull();

  rerender(
    <DetailSection title="Genres" items={items} onDelete={onDelete} canEdit />
  );
  fireEvent.click(container.querySelector('svg') as Element);
  expect(onDelete).toHaveBeenCalledWith(3);

  rerender(<DetailSection title="Binders" />);
  expect(screen.getByText('No binders to show')).toBeInTheDocument();
});

test('MobileNavLink renders a link for a route and a button otherwise', () => {
  const onClick = vi.fn();
  render(
    <MemoryRouter>
      <MobileNavLink to="/songs" text="Songs" />
      <MobileNavLink onClick={onClick} text="Menu" />
    </MemoryRouter>
  );
  expect(screen.getByRole('link', { name: 'Songs' })).toHaveAttribute(
    'href',
    '/songs'
  );
  fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
  expect(onClick).toHaveBeenCalled();
});

test('IconButton and TrackSourceButton call their handlers', () => {
  const onIconClick = vi.fn();
  const onSourceClick = vi.fn();
  render(
    <>
      <IconButton color="blue" onClick={onIconClick}>
        Add
      </IconButton>
      <TrackSourceButton
        source="Spotify"
        icon="spotify.svg"
        onClick={onSourceClick}
      />
    </>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Add' }));
  expect(onIconClick).toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: /Spotify/ }));
  expect(onSourceClick).toHaveBeenCalledWith('Spotify');
  expect(screen.getByAltText('Track Source')).toHaveAttribute('width', '25');
});

test('a page effect with a block body still sets the title', () => {
  document.title = '';
  renderWithProvider(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
  expect(document.title).toBe('Login');
});
