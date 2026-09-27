import { fireEvent, screen } from '@testing-library/react';
import { renderWithProvider } from '../utils/test';
import MetronomeSheet from './MetronomeSheet';
import type { Song } from '../types';

const editor = {
  auth: {
    currentUser: { id: 1, role: { permissions: [{ name: 'Edit songs' }] } },
  },
};

const song = (id: number) => ({ id, name: `Song ${id}`, bpm: 90 }) as Song;

test('MetronomeSheet drops unsaved changes when another song is shown', () => {
  const onSongChange = vi.fn<(field: 'bpm', value?: number) => void>();
  const { container, rerender } = renderWithProvider(
    <MetronomeSheet song={song(1)} onSongChange={onSongChange} />,
    { preloadedState: editor }
  );
  // The metronome's plus button.
  fireEvent.click(container.querySelector('button.ml-2')!);
  expect(onSongChange).toHaveBeenCalledWith('bpm', 91);
  expect(screen.getByText('Save changes')).toBeInTheDocument();

  // The same song, as a new object: the changes are kept.
  rerender(<MetronomeSheet song={song(1)} onSongChange={onSongChange} />);
  expect(screen.getByText('Save changes')).toBeInTheDocument();

  rerender(<MetronomeSheet song={song(2)} onSongChange={onSongChange} />);
  expect(screen.queryByText('Save changes')).not.toBeInTheDocument();
});
