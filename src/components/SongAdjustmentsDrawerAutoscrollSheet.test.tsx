import { fireEvent, render, screen } from '@testing-library/react';
import SongAdjustmentsDrawerAutoscrollSheet from './SongAdjustmentsDrawerAutoscrollSheet';
import type { Song } from '../types';

const song: Song = {
  id: 1,
  name: 'Amazing Grace',
  format: {},
  scroll_speed: 3,
};

test('the drawer starts and stops auto scroll with a toggle button', () => {
  const onToggle = vi.fn<() => void>();
  const { rerender } = render(
    <SongAdjustmentsDrawerAutoscrollSheet
      song={song}
      onShowMainSheet={() => {}}
      onSongChange={() => {}}
      onToggleAutoScrolling={onToggle}
    />
  );
  const start = screen.getByRole('button', { name: 'Start auto scroll' });
  expect(start).toHaveAttribute('aria-pressed', 'false');
  fireEvent.click(start);
  expect(onToggle).toHaveBeenCalledTimes(1);

  rerender(
    <SongAdjustmentsDrawerAutoscrollSheet
      song={song}
      onShowMainSheet={() => {}}
      onSongChange={() => {}}
      autoScrolling
      onToggleAutoScrolling={onToggle}
    />
  );
  expect(
    screen.getByRole('button', { name: 'Stop auto scroll' })
  ).toHaveAttribute('aria-pressed', 'true');
});
