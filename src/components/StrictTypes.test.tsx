import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import Button from './Button';
import DetailSection from './DetailSection';
import EventColorOption from './EventColorOption';
import MarkingOptionsPopover from './MarkingOptionsPopover';
import ShapeMarking from './ShapeMarking';
import SongApi from '../api/SongApi';
import { toPdf } from '../utils/PdfUtils';
import type { Song } from '../types';

// Pins the behavior around the code CAD-127 rewrote to pass strict.

vi.mock('axios');

afterEach(() => {
  vi.resetAllMocks();
});

test('ShapeMarking renders known shapes and nothing for others', () => {
  const { container, rerender } = render(
    <ShapeMarking
      marking={{ id: 1, marking_type: 'shape', content: 'crescendo' }}
    />
  );
  expect(container.querySelector('svg')).not.toBeNull();

  rerender(
    <ShapeMarking
      marking={{ id: 1, marking_type: 'shape', content: 'circle' }}
    />
  );
  expect(container).toBeEmptyDOMElement();

  rerender(<ShapeMarking marking={{ id: 1, marking_type: 'shape' }} />);
  expect(container).toBeEmptyDOMElement();

  rerender(
    <ShapeMarking marking={{ id: 1, marking_type: 'shape', content: '' }} />
  );
  expect(container).toBeEmptyDOMElement();
});

test('EventColorOption without a color keeps its "undefined" class', () => {
  const onClick = vi.fn();
  render(<EventColorOption onClick={onClick} />);
  const button = screen.getByRole('button');
  expect(button.className).toContain(' undefined ');
  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledWith(undefined);
});

test("an accent Button gets its size's padding", () => {
  const { rerender } = render(<Button variant="accent">Save</Button>);
  expect(screen.getByRole('button')).toHaveClass('px-3', 'h-9');

  rerender(
    <Button variant="accent" size="md">
      Save
    </Button>
  );
  expect(screen.getByRole('button')).toHaveClass('px-10', 'h-14');
  expect(screen.getByRole('button').className).not.toContain('undefined');
});

test('DetailSection shows its empty message without items', () => {
  const { rerender } = render(<DetailSection title="Genres" />);
  expect(screen.getByText('No genres to show')).toBeInTheDocument();

  rerender(<DetailSection title="Genres" items={[]} />);
  expect(screen.getByText('No genres to show')).toBeInTheDocument();

  rerender(<DetailSection title="Genres" items={[{ id: 1, name: 'Rock' }]} />);
  expect(screen.queryByText('No genres to show')).toBeNull();
  expect(screen.getByText('Rock')).toBeInTheDocument();
});

test('MarkingOptionsPopover closes on a click outside it', () => {
  const onClose = vi.fn();
  render(
    <>
      <MarkingOptionsPopover onDelete={vi.fn()} onClose={onClose} />
      <p>Outside</p>
    </>
  );

  fireEvent.mouseDown(screen.getByText('Delete'));
  expect(onClose).not.toHaveBeenCalled();

  fireEvent.mouseDown(screen.getByText('Outside'));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('SongApi removes themes and genres only when there are some', () => {
  expect(SongApi.removeThemes(1, undefined)).toBeUndefined();
  expect(SongApi.removeThemes(1, [])).toBeUndefined();
  expect(SongApi.removeGenres(1, undefined)).toBeUndefined();
  expect(SongApi.removeGenres(1, [])).toBeUndefined();
  expect(axios.delete).not.toHaveBeenCalled();

  SongApi.removeThemes(1, [2]);
  SongApi.removeGenres(1, [3]);
  expect(axios.delete).toHaveBeenCalledTimes(2);
});

function chordLine(song: Song) {
  // Like TypedStragglers.test.tsx: react-pdf elements, down to the first line.
  const page = toPdf(song, true).props.children;
  const body = page.props.children.props.children[1];
  const [line] = body.props.children;
  return line.props.children.props.children;
}

test.each([
  ['no capo', undefined, 'C  G'],
  ['a null capo', null, 'C  G'],
  ['a capo with no key', { capo_key: null }, 'C  G'],
  ['a capo', { id: 1, capo_key: 'A' }, 'A  E'],
])('toPdf with %s', (_, capo, expected) => {
  const song: Song = {
    id: 1,
    name: 'Song',
    content: 'C  G\nHello',
    original_key: 'C',
    show_capo: true,
    capo,
    format: { font: 'Open Sans' },
  };
  expect(chordLine(song)).toBe(expected);
});
