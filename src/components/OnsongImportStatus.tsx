import { Link } from 'react-router-dom';
import Button, { buttonClasses } from './Button';
import Icon from './Icon';
import PageLoading from './PageLoading';
import { LIST_ITEM } from './lists/listItem';

type OnsongImportStatusProps = {
  importing: boolean;
  /** The names of the songs that failed to import. */
  errors?: string[];
  onReset: () => void;
};

const CARD =
  'flex flex-col items-center gap-2 px-6 py-10 text-center rounded-extra-large-increased bg-surface-container-low text-on-surface font-plain';

// After the import: a loading state, then a card saying it's done, or which
// songs couldn't be imported.
export default function OnsongImportStatus({
  importing,
  errors,
  onReset,
}: OnsongImportStatusProps) {
  if (importing) {
    return <PageLoading>Importing your songs</PageLoading>;
  }

  const viewSongs = (
    <Link
      to="/songs"
      className={buttonClasses({ size: 'md', className: 'flex-center' })}
    >
      View songs
    </Link>
  );

  if (errors) {
    return (
      <section className={CARD}>
        <span className="mb-2 w-16 h-16 flex-center rounded-full bg-error-container text-on-error-container">
          <Icon name="warning" className="w-8 h-8" />
        </span>
        <h1 className="text-headline-small-emphasized">
          Some songs couldn&apos;t be imported
        </h1>
        <p className="text-body-medium text-on-surface-variant">
          This is most likely a problem with the files&apos; encoding.
        </p>
        <div className="w-full my-4 text-left list-segmented">
          {errors.map((songName, index) => (
            <div key={index} className={LIST_ITEM}>
              <span className="min-w-0 truncate">{songName}</span>
            </div>
          ))}
        </div>
        {viewSongs}
      </section>
    );
  }

  return (
    <section className={CARD}>
      <span className="mb-2 w-16 h-16 flex-center rounded-full bg-primary-container text-on-primary-container">
        <Icon name="check" className="w-8 h-8" />
      </span>
      <h1 className="text-headline-small-emphasized">Import successful!</h1>
      <p className="text-body-medium text-on-surface-variant">
        Your songs have finished importing.
      </p>
      <div className="flex flex-wrap justify-center w-full gap-2 mt-6">
        <Button variant="accent" color="gray" size="md" onClick={onReset}>
          Import more
        </Button>
        {viewSongs}
      </div>
    </section>
  );
}
