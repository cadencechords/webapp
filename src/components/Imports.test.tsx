import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import ImportCadenceSongsPage from '../pages/ImportCadenceSongsPage';
import ImportFilesPage from '../pages/ImportFilesPage';
import ImportSongsPage from '../pages/ImportSongsPage';
import OnsongImportPage from '../pages/OnsongImportPage';
import PcoRedirectPage from '../pages/PcoRedirectPage';
import PlanningCenterSongsPage from '../pages/PlanningCenterSongsPage';
import ImportsApi from '../api/importsApi';
import OnsongApi from '../api/onsongApi';
import BinderApi from '../api/BinderApi';
import PlanningCenterApi from '../api/PlanningCenterApi';
import { renderWithProvider } from '../utils/test';
import type { ReactElement } from 'react';

vi.mock('../api/importsApi');
vi.mock('../api/onsongApi');
vi.mock('../api/BinderApi');
vi.mock('../api/PlanningCenterApi');
vi.mock('../utils/error');

beforeEach(() => {
  vi.resetAllMocks();
});

// The mocked API methods resolve with only the `data` the pages read.
type Response<F extends (...args: never[]) => unknown> = Awaited<ReturnType<F>>;

function member(
  permissions: string[],
  extra: { pco_connected?: boolean } = {}
) {
  return {
    id: 1,
    email: 'me@example.com',
    role: {
      id: 1,
      name: 'Member',
      permissions: permissions.map(name => ({ name })),
    },
    ...extra,
  };
}

function renderAt(
  path: string,
  page: ReactElement,
  currentUser = member(['Add songs'])
) {
  return renderWithProvider(
    <MemoryRouter initialEntries={[path]}>
      <Switch>
        <Route path="/songs">Song library</Route>
        <Route path="/import/planning-center">PCO songs</Route>
        <Route path="/">{page}</Route>
      </Switch>
    </MemoryRouter>,
    { preloadedState: { auth: { currentUser } } }
  );
}

function fileInput(container: HTMLElement) {
  const input = container.querySelector('input[type="file"]');
  if (!(input instanceof HTMLInputElement)) throw new Error('no file input');
  return input;
}

describe('ImportSongsPage', () => {
  test('links to each import source', () => {
    renderAt('/import', <ImportSongsPage />);
    const links = screen
      .getAllByRole('link')
      .map(link => link.getAttribute('href'));
    expect(links).toEqual([
      '/import/planning-center',
      '/import/onsong',
      '/import/cadence',
      '/import/files',
    ]);
    expect(
      screen.getByText("Import songs from other teams you're on in Mezzo")
    ).toBeInTheDocument();
  });

  test('sends members who cannot add songs to the library', () => {
    renderAt('/import', <ImportSongsPage />, member([]));
    expect(screen.getByText('Song library')).toBeInTheDocument();
  });
});

// user-event 12's upload gives the input a FileList with `item` and `length`
// as own properties, which FilesInput's Object.values would pick up as files.
function chooseFiles(input: HTMLInputElement, files: File[]) {
  fireEvent.change(input, { target: { files } });
}

describe('ImportFilesPage', () => {
  const pdf = new File(['%PDF'], 'song.pdf', { type: 'application/pdf' });

  test('imports the chosen files', async () => {
    vi.mocked(ImportsApi.import).mockResolvedValueOnce(
      {} as Response<typeof ImportsApi.import>
    );
    const { container } = renderAt('/import/files', <ImportFilesPage />);
    chooseFiles(fileInput(container), [pdf]);
    userEvent.click(screen.getByRole('button', { name: 'Import 1 song' }));

    expect(
      await screen.findByText('Everything imported successfully')
    ).toBeInTheDocument();
    expect(ImportsApi.import).toHaveBeenCalledWith([pdf]);
  });

  test('lists the errors the API responds with', async () => {
    vi.mocked(ImportsApi.import).mockRejectedValueOnce({
      response: { data: ['song.pdf could not be read'] },
    });
    const { container } = renderAt('/import/files', <ImportFilesPage />);
    chooseFiles(fileInput(container), [pdf]);
    userEvent.click(screen.getByRole('button', { name: 'Import 1 song' }));

    expect(
      await screen.findByText('song.pdf could not be read')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Your remaining songs imported successfully')
    ).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: 'Import more songs' }));
    expect(
      screen.getByRole('button', { name: 'Choose songs on device' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^Import \d/ })
    ).not.toBeInTheDocument();
  });
});

describe('ImportCadenceSongsPage', () => {
  test('imports the chosen songs from the chosen team', async () => {
    vi.mocked(ImportsApi.getImportableTeams).mockResolvedValueOnce({
      data: [{ id: 5, name: 'Other team' }],
    } as Response<typeof ImportsApi.getImportableTeams>);
    vi.mocked(ImportsApi.getImportableSongs).mockResolvedValueOnce({
      data: [
        { id: 11, name: 'Amazing Grace', original_key: 'G', format: {} },
        { id: 12, name: 'How Great', format: {} },
      ],
    } as Response<typeof ImportsApi.getImportableSongs>);
    vi.mocked(ImportsApi.importSongsFromTeam).mockResolvedValueOnce(
      {} as Response<typeof ImportsApi.importSongsFromTeam>
    );
    renderAt('/import/cadence', <ImportCadenceSongsPage />);

    const chooseSongs = await screen.findByRole('button', {
      name: /choose songs/i,
    });
    expect(chooseSongs).toBeDisabled();
    const team = screen.getByText('Other team').closest('label');
    expect(team).toHaveAttribute('id', '5');
    userEvent.click(screen.getByRole('radio'));
    userEvent.click(chooseSongs);

    userEvent.click(await screen.findByText('Amazing Grace'));
    expect(ImportsApi.getImportableSongs).toHaveBeenCalledWith(5);
    const [importButton] = screen.getAllByRole('button', {
      name: 'Import 1 song',
    });
    userEvent.click(importButton);

    expect(await screen.findByText('Import successful!')).toBeInTheDocument();
    expect(ImportsApi.importSongsFromTeam).toHaveBeenCalledWith(5, [11]);
  });
});

describe('OnsongImportPage', () => {
  const backup = new File(['zip'], 'library.backup');
  const files = [
    { id: 1, name: 'Song A' },
    { id: 2, name: 'Song B' },
  ];

  async function chooseAllSongs(container: HTMLElement) {
    vi.mocked(OnsongApi.unzip).mockResolvedValueOnce({
      data: { id: 42, files },
    } as Response<typeof OnsongApi.unzip>);
    userEvent.upload(fileInput(container), backup);
    expect(await screen.findByText('2 songs in backup')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Check all' }));
    expect(screen.getByText('2 selected')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: /choose binder/i }));
  }

  test('imports the chosen songs into the chosen binder', async () => {
    vi.mocked(BinderApi.getAll).mockResolvedValueOnce({
      data: [{ id: 9, name: 'Sunday' }],
    } as Response<typeof BinderApi.getAll>);
    vi.mocked(OnsongApi.import).mockResolvedValueOnce(
      {} as Response<typeof OnsongApi.import>
    );
    const { container } = renderAt('/import/onsong', <OnsongImportPage />);
    await chooseAllSongs(container);

    userEvent.click(await screen.findByText('Sunday'));
    userEvent.click(screen.getByRole('button', { name: /review/i }));
    expect(screen.getByText('Importing 2 songs')).toBeInTheDocument();
    expect(screen.getByText('Into the "Sunday" binder')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Import!' }));

    expect(
      await screen.findByText('Your songs have finished importing!')
    ).toBeInTheDocument();
    expect(OnsongApi.unzip).toHaveBeenCalledWith(backup);
    expect(OnsongApi.import).toHaveBeenCalledWith(files, 9, 42);
  });

  test('lists the songs the API could not import', async () => {
    const noBinders: Response<typeof BinderApi.getAll>['data'] = [];
    vi.mocked(BinderApi.getAll).mockResolvedValueOnce({
      data: noBinders,
    } as Response<typeof BinderApi.getAll>);
    vi.mocked(OnsongApi.import).mockRejectedValueOnce({
      response: { data: { errors: ['Song B'] } },
    });
    const { container } = renderAt('/import/onsong', <OnsongImportPage />);
    await chooseAllSongs(container);

    expect(
      await screen.findByText(/you don't have any binders/i)
    ).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: /review/i }));
    userEvent.click(screen.getByRole('button', { name: 'Import!' }));

    expect(
      await screen.findByText(/couldn't import some songs/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Song B')).toBeInTheDocument();
    expect(OnsongApi.import).toHaveBeenCalledWith(files, undefined, 42);
  });

  test('sends members who cannot add songs to the library', () => {
    renderAt('/import/onsong', <OnsongImportPage />, member([]));
    expect(screen.getByText('Song library')).toBeInTheDocument();
  });
});

describe('PcoRedirectPage', () => {
  test('authorizes with the code, then opens the songs', async () => {
    vi.mocked(PlanningCenterApi.authorize).mockResolvedValueOnce(
      {} as Response<typeof PlanningCenterApi.authorize>
    );
    renderAt('/pco?code=abc', <PcoRedirectPage />);

    expect(await screen.findByText('PCO songs')).toBeInTheDocument();
    expect(PlanningCenterApi.authorize).toHaveBeenCalledWith('abc');
  });

  test('does nothing without a code', () => {
    renderAt('/pco', <PcoRedirectPage />);
    expect(
      screen.getByText('Connecting to your account...')
    ).toBeInTheDocument();
    expect(PlanningCenterApi.authorize).not.toHaveBeenCalled();
  });
});

describe('PlanningCenterSongsPage', () => {
  beforeEach(() => {
    // The selected songs Modal checks the breakpoints.
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('imports the selected songs', async () => {
    vi.mocked(PlanningCenterApi.getSongs).mockResolvedValue({
      data: [
        { id: 'p1', title: 'Holy' },
        { id: 'p2', title: 'Worthy' },
      ],
    } as Response<typeof PlanningCenterApi.getSongs>);
    vi.mocked(PlanningCenterApi.importSongs).mockResolvedValueOnce(
      {} as Response<typeof PlanningCenterApi.importSongs>
    );
    renderAt(
      '/planning-center-songs',
      <PlanningCenterSongsPage />,
      member(['Add songs'], { pco_connected: true })
    );

    userEvent.click(await screen.findByText('Worthy'));
    expect(screen.getByText(/^1 selected/)).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'View selected' }));
    expect(await screen.findByText('1 song selected')).toBeInTheDocument();
    expect(screen.getAllByText('Worthy')).toHaveLength(2);
    const [importButton] = screen.getAllByRole('button', {
      name: 'Import 1 song',
    });
    userEvent.click(importButton);

    await waitFor(() =>
      expect(PlanningCenterApi.importSongs).toHaveBeenCalledWith(['p2'])
    );
    expect(await screen.findByText(/^0 selected/)).toBeInTheDocument();
  });
});
