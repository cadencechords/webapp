import BinderApi from '../api/BinderApi';
import Button from './Button';
import BinderIcon from '../icons/BinderIcon';
import ImportStepHeader from './ImportStepHeader';
import classNames from 'classnames';
import { LIST_ITEM, LIST_ITEM_INTERACTIVE } from './lists/listItem';
import PageLoading from './PageLoading';
import { reportError } from '../utils/error';
import { useEffect, type ReactNode } from 'react';
import { useState } from 'react';
import Icon from './Icon';
import type { Binder } from '../types';

type OnsongChooseBinderForSongsProps = {
  /** Undefined until loaded, which this does when it mounts. */
  binders?: Binder[];
  onBindersLoaded: (binders: Binder[]) => void;
  onSelectBinder: (binder: Binder) => void;
  selectedBinder?: Binder | null;
  onBackClick: () => void;
  onNextClick: () => void;
};

export default function OnsongChooseBinderForSongs({
  binders,
  onBindersLoaded,
  onSelectBinder,
  selectedBinder,
  onBackClick,
  onNextClick,
}: OnsongChooseBinderForSongsProps) {
  const [loadingBinders, setLoadingBinders] = useState(false);
  useEffect(() => {
    async function fetchBinders() {
      try {
        setLoadingBinders(true);
        const { data } = await BinderApi.getAll();
        onBindersLoaded(data);
      } catch (error) {
        reportError(error);
      } finally {
        setLoadingBinders(false);
      }
    }

    if (!binders) {
      fetchBinders();
    }
  }, [binders, onBindersLoaded]);

  let content: ReactNode = null;

  if (loadingBinders) {
    content = <PageLoading>Opening your folders</PageLoading>;
  } else if (binders?.length === 0) {
    content = (
      <p className="px-4 py-3 text-body-medium text-on-surface-variant">
        Looks like you don&apos;t have any folders yet. You can just continue.
      </p>
    );
  } else {
    content = (
      <div role="radiogroup" className="list-segmented">
        {binders?.map(binder => {
          const selected = selectedBinder === binder;
          return (
            // A folder row: primary-container with a check when chosen;
            // choosing it again unchooses it.
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              key={binder.id}
              onClick={() => onSelectBinder(binder)}
              className={classNames(
                LIST_ITEM,
                LIST_ITEM_INTERACTIVE,
                'w-full text-left',
                selected && 'bg-primary-container text-on-primary-container'
              )}
            >
              <BinderIcon
                className={classNames(
                  'w-6 h-6 shrink-0',
                  !selected && 'text-on-surface-variant'
                )}
              />
              <span className="flex-1 min-w-0 truncate">{binder.name}</span>
              {selected && (
                <Icon name="check_circle" filled className="w-6 h-6 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Step 3: an optional folder for the songs.
  return (
    <>
      <ImportStepHeader
        step="Step 3 of 4"
        title="Choose a folder"
        subtitle="Optional: add the songs to a folder, or continue without one."
        onBack={onBackClick}
        backLabel="Back to choosing songs"
      />
      {content}
      <div className="flex justify-end mt-6">
        <Button
          size="md"
          className="w-full gap-2 flex-center sm:w-auto"
          onClick={onNextClick}
        >
          Review
          <Icon name="arrow_forward" className="w-5 h-5" />
        </Button>
      </div>
    </>
  );
}
