import type { ComponentType } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProvider } from '../utils/test';
import AccountDetailPage from './AccountDetailPage';
import AccountGeneralSettingsPage from './AccountGeneralSettingsPage';
import AccountProfilePage from './AccountProfilePage';
import MembersIndexPage from './MembersIndexPage';
import TeamDetailPage from './TeamDetailPage';
import FormattedSong from '../components/FormattedSong';
import ThemeProvider from '../contexts/ThemeProvider';

vi.mock('../api/InvitationApi');
vi.mock('../api/TeamApi');
vi.mock('../utils/error');

// Signed-in user with no role, so `selectCurrentMember` returns null.
const user = { id: 1 };

// Before their data loads, these pages render their loading text as a single
// bare text node, as they did when they returned the string itself.
test.each([
  ['AccountDetailPage', AccountDetailPage, {}, 'Loading...'],
  ['AccountGeneralSettingsPage', AccountGeneralSettingsPage, {}, 'Loading...'],
  ['AccountProfilePage', AccountProfilePage, {}, 'Loading...'],
  // Loads until the current team and subscription are in the store.
  ['TeamDetailPage', TeamDetailPage, { currentUser: user }, 'Loading...'],
  // Its loading branch needs no current user, but `selectCurrentMember`
  // throws without one, so a falsy non-null user is the only way to reach it.
  ['MembersIndexPage', MembersIndexPage, { currentUser: '' }, 'Loading ...'],
] as [string, ComponentType, object, string][])(
  '%s renders its loading text',
  (_name, Page, auth, text) => {
    const { container } = renderWithProvider(
      <ThemeProvider>
        <MemoryRouter>
          <Page />
        </MemoryRouter>
      </ThemeProvider>,
      { preloadedState: { auth } }
    );

    expect(container.innerHTML).toBe(text);
    expect(container.childNodes).toHaveLength(1);
    expect(container.firstChild?.nodeType).toBe(Node.TEXT_NODE);
  }
);

test('FormattedSong renders a song without content as one empty text node', () => {
  const { container } = render(
    <FormattedSong song={{ content: '', format: {} }} />
  );

  expect(container.innerHTML).toBe('');
  expect(container.childNodes).toHaveLength(1);
  expect(container.firstChild?.nodeType).toBe(Node.TEXT_NODE);
});

test('FormattedSong renders the song lines, chords included', () => {
  const { container } = render(
    <FormattedSong
      song={{
        content: 'Gmaj7\nAmazing grace',
        format: { chords_hidden: true },
      }}
    />
  );

  expect(container.textContent).toContain('Amazing grace');
  // The editor preview always shows chords, even when the song hides them.
  expect(container.textContent).toContain('Gmaj7');
  expect(container.querySelector('.hidden')).toBeNull();
});
