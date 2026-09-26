import { act, fireEvent, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import SongsCarouselSlide from './SongsCarouselSlide';
import { renderWithProvider } from '../utils/test';
import type { PresentedSong } from '../store/presenterSlice';

// Only the note delete matters here: a button deleting the song's first
// note. The roadmap and annotations need providers this test doesn't use.
vi.mock('./Roadmap', () => ({ default: () => null }));
vi.mock('./Annotations', () => ({ default: () => null }));
vi.mock('./NotesList', () => ({
  default: ({
    song,
    onDelete,
  }: {
    song: PresentedSong;
    onDelete: (noteId: number) => void;
  }) => (
    <button onClick={() => onDelete(song.notes![0].id)}>Delete note</button>
  ),
}));

type OnSongUpdate = ComponentProps<typeof SongsCarouselSlide>['onSongUpdate'];

const song: PresentedSong = {
  id: 1,
  name: 'Amazing Grace',
  content: '',
  format: {},
  notes: [{ id: 5, content: 'Slow down', color: 'blue', line_number: 1 }],
};

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

function renderSlide(onSongUpdate: OnSongUpdate) {
  const slide = (update: OnSongUpdate) => (
    <SongsCarouselSlide
      song={song}
      onDisableSwipe={() => {}}
      onEnableSwipe={() => {}}
      onSongUpdate={update}
    />
  );
  const result = renderWithProvider(slide(onSongUpdate), {
    preloadedState: { subscription: { subscription: { isPro: true } } },
  });
  return { rerender: (update: OnSongUpdate) => result.rerender(slide(update)) };
}

test('passes a note deletion on 200ms after the last change', () => {
  const onSongUpdate = vi.fn<OnSongUpdate>();
  renderSlide(onSongUpdate);

  fireEvent.click(screen.getByText('Delete note'));
  act(() => {
    vi.advanceTimersByTime(199);
  });
  expect(onSongUpdate).not.toHaveBeenCalled();

  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(onSongUpdate).toHaveBeenCalledWith('notes', []);
});

// SetPresenterPage's onSongUpdate changes the song being viewed when it runs,
// so a waiting edit must go through the one it was made with.
test('a waiting edit goes through the onSongUpdate it was made with', () => {
  const whenEdited = vi.fn<OnSongUpdate>();
  const afterNavigating = vi.fn<OnSongUpdate>();
  const { rerender } = renderSlide(whenEdited);

  fireEvent.click(screen.getByText('Delete note'));
  rerender(afterNavigating);
  act(() => {
    vi.advanceTimersByTime(200);
  });

  expect(whenEdited).toHaveBeenCalledWith('notes', []);
  expect(afterNavigating).not.toHaveBeenCalled();
});
