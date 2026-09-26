import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchResults from './SearchResults';
import type { Binder, Setlist, Song } from '../types';

const results = {
  binders: [{ id: 1, name: 'Worship' } as Binder],
  songs: [
    { id: 2, name: 'Amazing Grace', format: {} } as Song,
    { id: 3, name: 'Grace Alone', format: {} } as Song,
  ],
  setlists: [] as Setlist[],
};

test('SearchResults links each result and keys the links', () => {
  const consoleError = vi.spyOn(console, 'error');
  const onCloseDialog = vi.fn();
  render(
    <MemoryRouter>
      <SearchResults
        results={results}
        searchQuery="grace"
        onCloseDialog={onCloseDialog}
      />
    </MemoryRouter>
  );

  const hrefs = screen
    .getAllByRole('link')
    .map(link => link.getAttribute('href'));
  expect(hrefs).toEqual(['/binders/1', '/songs/2', '/songs/3']);
  expect(screen.getByText('No sets found')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Worship'));
  expect(onCloseDialog).toHaveBeenCalled();

  // The keys used to sit on the SearchResult inside each Link, so React
  // warned that the list's children had no key.
  const keyWarnings = consoleError.mock.calls.filter(args =>
    String(args[0]).includes('unique "key"')
  );
  expect(keyWarnings).toEqual([]);
  consoleError.mockRestore();
});

test('SearchResults asks for a search before the first one', () => {
  render(<SearchResults results={null} searchQuery="" />);
  expect(screen.getByText(/try typing in the search bar/i)).toBeInTheDocument();
});
