import axios from 'axios';
import { fireEvent, render, waitFor } from '@testing-library/react';
import AnnotationsApi from './annotationsApi';
import BillingApi from './billingApi';
import BinderApi from './BinderApi';
import InvitationApi from './InvitationApi';
import NotesApi from './notesApi';
import OnsongApi from './onsongApi';
import SetlistApi from './SetlistApi';
import SongApi from './SongApi';
import UserApi from './UserApi';
import NotesDragDropContext from '../components/NotesDragDropContext';
import TapTempo from '../components/TapTempo';
import subscriptionReducer, {
  selectCurrentSubscription,
  setSubscription,
} from '../store/subscriptionSlice';
import type { Song } from '../types';

vi.mock('axios');
vi.mock('../utils/AuthUtils', () => ({
  getTeamId: () => '12',
  constructAuthHeaders: () => ({ 'access-token': 'token' }),
}));
vi.mock('../utils/error');

const API_URL = import.meta.env.REACT_APP_API_URL;
const headers = { 'access-token': 'token' };

beforeEach(() => {
  vi.resetAllMocks();
  // `api()` builds an instance with axios.create; hand back the mock itself.
  vi.mocked(axios.create).mockReturnValue(axios);
});

describe('the api helpers send the same requests', () => {
  test('SongApi.updateOneById sends only the allowed, set fields', () => {
    SongApi.updateOneById(3, {
      name: 'Amazing Grace',
      bpm: 0,
      transposed_key: null,
      roadmap: ['Verse', 'Chorus'],
    });

    expect(axios.put).toHaveBeenCalledWith(
      `${API_URL}/songs/3?team_id=12`,
      { name: 'Amazing Grace', transposed_key: null, roadmap: 'Verse@Chorus' },
      { headers }
    );
  });

  test('SongApi.removeThemes sends nothing without theme ids', () => {
    expect(SongApi.removeThemes(3, undefined)).toBeUndefined();
    expect(axios.delete).not.toHaveBeenCalled();
  });

  test('BinderApi.updateOneById trims the text fields', () => {
    BinderApi.updateOneById('5', { name: ' Hymns ', description: '' });

    expect(axios.put).toHaveBeenCalledWith(
      `${API_URL}/binders/5?team_id=12`,
      { name: 'Hymns' },
      { headers }
    );
  });

  test('SetlistApi.createOne and updateOne rename their fields', () => {
    const scheduledDate = new Date('2024-05-01T00:00:00Z');
    SetlistApi.createOne({ name: 'Sunday', scheduledDate });
    SetlistApi.updateOne({ publicLinkEnabled: false }, 8);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/setlists`,
      { name: 'Sunday', scheduled_date: scheduledDate, team_id: '12' },
      { headers }
    );
    expect(axios.put).toHaveBeenCalledWith(
      `${API_URL}/setlists/8`,
      { public_link_enabled: false, team_id: '12' },
      { headers }
    );
  });

  test('InvitationApi.createOne adds the team id', () => {
    InvitationApi.createOne({ email: 'new@example.com' });

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/invitations`,
      { email: 'new@example.com', team_id: '12' },
      { headers }
    );
  });

  test('OnsongApi.import leaves out a missing binder', () => {
    const songs = [{ name: 'a.onsong' }];
    OnsongApi.import(songs, undefined, 4);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/onsong/import/4?team_id=12`,
      { songs },
      { headers }
    );
    // toHaveBeenCalledWith ignores keys set to undefined; this doesn't.
    expect(vi.mocked(axios.post).mock.calls[0][1]).toStrictEqual({ songs });
  });

  test('OnsongApi.import sends a given binder id', () => {
    const songs = [{ name: 'a.onsong' }];
    OnsongApi.import(songs, 7, 4);

    expect(vi.mocked(axios.post).mock.calls[0][1]).toStrictEqual({
      songs,
      binder_id: 7,
    });
  });

  test('BillingApi sends a given return url', () => {
    BillingApi.createCustomerPortalSession('https://app.example.com/billing');

    expect(vi.mocked(axios.post).mock.calls[0][1]).toStrictEqual({
      return_url: 'https://app.example.com/billing',
    });
  });

  test('BillingApi sends a return url only when given one', () => {
    BillingApi.createCustomerPortalSession();

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/billing/customer_portal_sessions?team_id=12`,
      {},
      { headers }
    );
    expect(vi.mocked(axios.post).mock.calls[0][1]).toStrictEqual({});
  });

  test('the api() helpers use relative paths on the API base URL', () => {
    UserApi.getCurrentUser();
    NotesApi.create(3);
    AnnotationsApi.deleteBulk([1, 2], 3);

    expect(axios.create).toHaveBeenCalledWith({ baseURL: API_URL });
    expect(axios.get).toHaveBeenCalledWith('/users/me', { headers });
    expect(axios.post).toHaveBeenCalledWith(
      '/songs/3/notes?team_id=12',
      undefined,
      { headers }
    );
    expect(axios.delete).toHaveBeenCalledWith(
      '/songs/3/annotations?team_id=12&annotation_ids[]=1&annotation_ids[]=2',
      { headers }
    );
  });
});

describe('subscriptionSlice', () => {
  test('starts empty and copies is_pro to isPro', () => {
    const initial = subscriptionReducer(undefined, { type: 'init' });
    expect(initial).toStrictEqual({});

    const state = subscriptionReducer(
      initial,
      setSubscription({ plan_name: 'Pro', is_pro: true })
    );
    expect(selectCurrentSubscription({ subscription: state })).toEqual({
      plan_name: 'Pro',
      is_pro: true,
      isPro: true,
    });
  });
});

test('TapTempo reports the bpm from the time between two taps', () => {
  const onBpmChange = vi.fn();
  const onTap = vi.fn();
  const now = vi.spyOn(Date.prototype, 'getTime');
  const { getByText } = render(
    <TapTempo onBpmChange={onBpmChange} onTap={onTap} />
  );

  now.mockReturnValueOnce(1000);
  fireEvent.click(getByText('Tap'));
  expect(onBpmChange).not.toHaveBeenCalled();

  now.mockReturnValueOnce(1500);
  fireEvent.click(getByText('Tap'));
  expect(onBpmChange).toHaveBeenCalledWith(120);
  expect(onTap).toHaveBeenCalledTimes(2);
  now.mockRestore();
});

// Pins current behavior, known bug included: the arguments to notesApi.create
// are swapped, so this posts to /songs/<line number>/notes with the song id as
// the body. NotesDragDropContext is unused and slated for deletion.
test('double-clicking an empty line posts the song id to the line number', async () => {
  vi.mocked(axios.post).mockResolvedValue({ data: { id: 9 } });
  const song: Song = { id: 42, name: 'Song', content: 'a\nb\nc', format: {} };
  const onAddTempNote = vi.fn();
  const onReplaceTempNote = vi.fn();
  const { container } = render(
    <NotesDragDropContext
      song={song}
      onAddTempNote={onAddTempNote}
      onReplaceTempNote={onReplaceTempNote}
      onUpdateNote={vi.fn()}
      onDeleteNote={vi.fn()}
    />
  );

  const lines = container.querySelectorAll('[data-rbd-draggable-id]');
  fireEvent.doubleClick(lines[1]);

  const newNote = { content: '', color: 'yellow', line_number: 1 };
  expect(onAddTempNote).toHaveBeenCalledWith({
    id: expect.any(Number),
    ...newNote,
  });
  expect(axios.post).toHaveBeenCalledWith('/songs/1/notes?team_id=12', 42, {
    headers,
  });
  await waitFor(() =>
    expect(onReplaceTempNote).toHaveBeenCalledWith(
      onAddTempNote.mock.calls[0][0].id,
      { id: 9 }
    )
  );
});
