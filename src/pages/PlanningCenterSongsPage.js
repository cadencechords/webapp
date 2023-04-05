import PageHeader from '../components/PageHeader';
import usePlanningCenterAuthCheck from '../hooks/usePlanningCenterAuthCheck';
import usePermissionsCheck from '../hooks/usePermissionsCheck';
import { ADD_SONGS } from '../utils/constants';
import { Redirect } from 'react-router-dom';
import usePlanningCenterSongs from '../hooks/api/usePlanningCenterSongs';
import Alert from '../components/Alert';
import PageLoading from '../components/PageLoading';
import WellInput from '../components/inputs/WellInput';
import { Fragment, useState } from 'react';
import MobileMenuButton from '../components/buttons/MobileMenuButton';
import { PulseLoader } from 'react-spinners';
import Checkbox from '../components/Checkbox';
import Button from '../components/Button';
import NoDataMessage from '../components/NoDataMessage';
import { useDebounce } from 'usehooks-ts';
import { pluralize } from '../utils/StringUtils';
import useDialog from '../hooks/useDialog';
import SongsSelectedForImportModal from '../dialogs/SongsSelectedForImportModal';
import useImportPlanningCenterSongs from '../hooks/api/useImportPlanningCenterSongs';
import { toast } from 'react-toastify';

export default function PlanningCenterSongsPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 275);
  const isConnected = usePlanningCenterAuthCheck();
  const { can } = usePermissionsCheck();
  const canAddSongs = can(ADD_SONGS);
  const {
    data: { pages: songPages },
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = usePlanningCenterSongs(debouncedQuery);
  const { isLoading: isImporting, run: importSongs } =
    useImportPlanningCenterSongs({
      onSuccess: () => {
        toast.success('Songs imported successfully');
        setSelectedSongs([]);
      },
    });
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [isSelectedSongsModalVisible, showSelectedSongs, hideSelectedSongs] =
    useDialog();
  const isEmpty = songPages?.length === 0 || songPages?.[0]?.length === 0;

  function handleToggleSong(isChecked, song) {
    if (isChecked) {
      setSelectedSongs([...selectedSongs, song]);
    } else {
      setSelectedSongs(selectedSongs.filter(s => s !== song));
    }
  }

  function handleImportSongs() {
    const ids = selectedSongs.map(song => song.id);
    importSongs({ songIds: ids });
  }

  if (!canAddSongs || !isConnected) return <Redirect to="/songs" />;

  return (
    <div className="container max-w-4xl mx-auto">
      <PageHeader
        title="Import from Planning Center"
        headerRightVisible={false}
      />

      <div className="flex items-center h-8 mb-2">
        {selectedSongs.length} selected{' '}
        {selectedSongs.length > 0 && (
          <Button
            size="xs"
            variant="accent"
            className="ml-4"
            onClick={showSelectedSongs}
          >
            View selected
          </Button>
        )}
      </div>
      <WellInput
        placeholder="Search your songs"
        value={query}
        onChange={setQuery}
        className="mb-4 lg:text-sm"
      />
      {songPages && (
        <div>
          {isEmpty ? (
            <NoDataMessage type={'songs'} />
          ) : (
            <div className="mb-10 md:mb-4">
              {songPages.map((songs, index) => (
                <Fragment key={index}>
                  {songs.map(song => (
                    <label
                      key={song.id}
                      className="flex items-center h-12 gap-4 px-3 border-b sm:rounded-lg sm:hover:bg-gray-100 sm:dark:hover:bg-dark-gray-800 dark:border-dark-gray-600 last:border-0 sm:border-0"
                    >
                      <Checkbox
                        checked={selectedSongs.includes(song)}
                        onChange={isChecked =>
                          handleToggleSong(isChecked, song)
                        }
                        standAlone={false}
                      />
                      <span className="inline-block overflow-hidden whitespace-nowrap overflow-ellipsis">
                        {song.title}
                      </span>
                    </label>
                  ))}
                </Fragment>
              ))}
              {hasNextPage && (
                <MobileMenuButton
                  color="blue"
                  full={true}
                  onClick={fetchNextPage}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? (
                    <PulseLoader size="7px" color="#1f6feb" />
                  ) : (
                    'Load more'
                  )}
                </MobileMenuButton>
              )}
            </div>
          )}

          <SongsSelectedForImportModal
            open={isSelectedSongsModalVisible}
            onClose={hideSelectedSongs}
            selectedSongs={selectedSongs}
            onRemoveSong={song => handleToggleSong(false, song)}
          />
          {selectedSongs.length > 0 && (
            <SaveButton loading={isImporting} onClick={handleImportSongs}>
              Import {selectedSongs.length}{' '}
              {pluralize('song', selectedSongs.length)}
            </SaveButton>
          )}
        </div>
      )}
      {isError && (
        <Alert color="red">There was an issue retrieving your songs.</Alert>
      )}
      {isLoading && <PageLoading />}
    </div>
  );
}

function SaveButton({ children, loading, onClick }) {
  return (
    <>
      <Button
        className="fixed left-0 right-0 md:hidden bottom-12"
        style={{ borderRadius: 0 }}
        loading={loading}
        onClick={onClick}
      >
        {children}
      </Button>
      <Button
        className="fixed hidden w-32 bottom-8 right-8 md:inline-block whitespace-nowrap"
        loading={loading}
        onClick={onClick}
      >
        {children}
      </Button>
    </>
  );
}
