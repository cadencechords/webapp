import { act, render, screen } from '@testing-library/react';
import PresenterTopAppBar from './PresenterTopAppBar';
import SetlistNavigation from './SetlistNavigation';
import type { Song } from '../types';

/** Moves the window to `y` and fires the scroll event, as a browser would. */
function scrollTo(y: number) {
  act(() => {
    window.scrollY = y;
    window.dispatchEvent(new Event('scroll'));
  });
}

beforeEach(() => {
  window.scrollY = 0;
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: 800,
  });
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: 5000,
  });
});

test('shows the title and subtitle on the surface until the song scrolls under it', () => {
  render(<PresenterTopAppBar title="Amazing Grace" subtitle="Sunday AM" />);
  const bar = screen.getByRole('navigation');
  expect(
    screen.getByRole('heading', { name: 'Amazing Grace' })
  ).toBeInTheDocument();
  expect(screen.getByText('Sunday AM')).toBeInTheDocument();
  expect(bar).toHaveClass('bg-surface');

  scrollTo(4);
  expect(bar).toHaveClass('bg-surface-container');
});

test('slides away scrolling down and comes back scrolling up, near the top or at the end', () => {
  render(<PresenterTopAppBar title="Amazing Grace" />);
  const bar = screen.getByRole('navigation');

  scrollTo(300);
  expect(bar).toHaveClass('-translate-y-full');

  // Small movements don't flip it.
  scrollTo(296);
  expect(bar).toHaveClass('-translate-y-full');

  scrollTo(200);
  expect(bar).not.toHaveClass('-translate-y-full');

  scrollTo(1000);
  expect(bar).toHaveClass('-translate-y-full');

  // The end of the song: 800 tall, within 48 of the 5000 bottom.
  scrollTo(4160);
  expect(bar).not.toHaveClass('-translate-y-full');

  scrollTo(1000);
  scrollTo(2000);
  expect(bar).toHaveClass('-translate-y-full');
  scrollTo(0);
  expect(bar).not.toHaveClass('-translate-y-full');
});

test('the contextual bar never hides and uses secondary-container', () => {
  render(<PresenterTopAppBar contextual title="Annotate" />);
  const bar = screen.getByRole('navigation');
  expect(bar).toHaveClass('bg-secondary-container');

  scrollTo(300);
  expect(bar).not.toHaveClass('-translate-y-full');
});

test('the set toolbar stays while the top app bar slides away', () => {
  const songs = [
    { id: 1, name: 'First', format: {} },
    { id: 2, name: 'Second', format: {} },
  ] as Song[];
  render(
    <>
      <PresenterTopAppBar title="First" />
      <SetlistNavigation songs={songs} index={0} onIndexChange={() => {}} />
    </>
  );

  scrollTo(300);
  expect(screen.getAllByRole('navigation')[0]).toHaveClass('-translate-y-full');
  const toolbar = screen.getByRole('navigation', { name: 'Set' });
  expect(toolbar.parentElement!.className).not.toContain('translate');
});
