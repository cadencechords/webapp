import { fireEvent, screen } from '@testing-library/react';
import { renderWithProvider } from '../utils/test';
import Roadmap from './Roadmap';

const member = {
  auth: {
    currentUser: { id: 1, role: { id: 1, name: 'Member', permissions: [] } },
  },
};

test('an empty roadmap offers a labelled Add section button', () => {
  const onSongChange = vi.fn<(field: 'roadmap', value: string[]) => void>();
  renderWithProvider(
    <Roadmap song={{ id: 1, roadmap: [] }} onSongChange={onSongChange} />,
    { preloadedState: member }
  );
  expect(screen.getByRole('heading', { name: 'Roadmap' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Add section' }));
  expect(onSongChange).toHaveBeenCalledWith('roadmap', ['New']);
});

test('shows the sections as chips in play order, with a chevron between each', () => {
  const onSongChange = vi.fn<(field: 'roadmap', value: string[]) => void>();
  const { container } = renderWithProvider(
    <Roadmap
      song={{ id: 1, roadmap: ['Verse', 'Chorus', 'Bridge'] }}
      onSongChange={onSongChange}
    />,
    { preloadedState: member }
  );
  const chips = ['Verse', 'Chorus', 'Bridge'].map(name =>
    screen.getByText(name)
  );
  chips.forEach(chip => expect(chip).toHaveClass('bg-secondary-container'));
  // Two chevrons for three sections, none after the last.
  expect(
    container.querySelectorAll('.text-on-surface-variant.w-4')
  ).toHaveLength(2);
  fireEvent.click(screen.getByRole('button', { name: 'Add section' }));
  expect(onSongChange).toHaveBeenCalledWith('roadmap', [
    'Verse',
    'Chorus',
    'Bridge',
    'New',
  ]);
});
