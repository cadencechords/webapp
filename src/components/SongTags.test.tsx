import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SongTags from './SongTags';
import type { Binder, Tag } from '../types';

const binders = [{ id: 1, name: 'Sunday', color: 'red' } as Binder];
const genres: Tag[] = [{ id: 2, name: 'Hymn' }];

function renderTags(canEdit: boolean) {
  const handlers = {
    onAddGenre: vi.fn<() => void>(),
    onAddTheme: vi.fn<() => void>(),
    onRemoveGenre: vi.fn<(id: number) => void>(),
    onRemoveTheme: vi.fn<(id: number) => void>(),
  };
  render(
    <MemoryRouter>
      <SongTags
        binders={binders}
        genres={genres}
        themes={[]}
        canEdit={canEdit}
        {...handlers}
      />
    </MemoryRouter>
  );
  return handlers;
}

const section = (name: string) => screen.getByRole('region', { name });

test('each kind under its heading; folders link to the folder', () => {
  renderTags(false);
  expect(
    within(section('Folders')).getByRole('link', { name: 'Sunday' })
  ).toHaveAttribute('href', '/folders/1');
  expect(within(section('Genres')).getByText('Hymn')).toBeInTheDocument();
  expect(within(section('Themes')).getByText('No themes')).toBeInTheDocument();
  expect(screen.queryByRole('button')).toBeNull();
});

test('editing removes and adds genres and themes', () => {
  const handlers = renderTags(true);
  fireEvent.click(screen.getByRole('button', { name: 'Remove genre Hymn' }));
  expect(handlers.onRemoveGenre).toHaveBeenCalledWith(2);
  fireEvent.click(screen.getByRole('button', { name: 'Add genres' }));
  expect(handlers.onAddGenre).toHaveBeenCalled();
  // An empty section you can edit shows just its add button.
  expect(screen.queryByText('No themes')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Add themes' }));
  expect(handlers.onAddTheme).toHaveBeenCalled();
});
