import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setSetlistBeingPresented } from '../store/presenterSlice';
import Button from './Button';
import Icon from './Icon';

type EditorNavbarProps = {
  dirty: boolean;
  name: string;
  onSave: () => void;
  saving: boolean;
  onToggleFormatOptions: () => void;
  isFormatOpen: boolean;
};

// The editor's M3 small top app bar, stuck to the top: back, the song's name
// (with "Unsaved changes" under it while there are some), then a toggle for
// the format options and a filled Save.
export default function EditorNavbar({
  dirty,
  name,
  onSave,
  saving,
  onToggleFormatOptions,
  isFormatOpen,
}: EditorNavbarProps) {
  const router = useHistory();
  const dispatch = useDispatch();

  function handleGoBack() {
    dispatch(setSetlistBeingPresented({}));
    router.goBack();
  }

  return (
    <header className="sticky top-0 z-20 bg-surface font-plain text-on-surface">
      <div className="flex items-center gap-2 px-2 mx-auto h-16 max-w-7xl sm:px-4">
        <Button
          variant="icon"
          size="md"
          color="gray"
          name="Back"
          onClick={handleGoBack}
        >
          <Icon name="arrow_back" className="w-6 h-6" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="truncate text-title-large">{name}</h1>
          {dirty && (
            <div className="text-label-medium text-on-surface-variant">
              Unsaved changes
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label="Format options"
          aria-pressed={isFormatOpen}
          onClick={onToggleFormatOptions}
          // M3 standard toggle icon button: a tonal container when selected.
          className={classNames(
            'flex-center shrink-0 w-10 h-10 rounded-[20px] [--shape-morph-to:8px] state-layer-flat focus-ring shape-morph',
            isFormatOpen
              ? 'bg-secondary-container text-on-secondary-container'
              : 'text-on-surface-variant'
          )}
        >
          <Icon name="tune" className="w-6 h-6" />
        </button>
        <Button
          size="sm"
          disabled={!dirty}
          onClick={onSave}
          loading={saving}
          className="shrink-0 ml-1"
        >
          Save
        </Button>
      </div>
    </header>
  );
}
