import Button from './Button';
import { Link } from 'react-router-dom';
import PageLoading from './PageLoading';

type OnsongImportStatusProps = {
  importing: boolean;
  /** The names of the songs that failed to import. */
  errors?: string[];
  onReset: () => void;
};

export default function OnsongImportStatus({
  importing,
  errors,
  onReset,
}: OnsongImportStatusProps) {
  if (importing) {
    return (
      <PageLoading>
        <h2 className="font-semibold text-2xl">
          Hang tight while we import your songs
        </h2>
      </PageLoading>
    );
  } else if (!importing && errors) {
    return (
      <div>
        <h4 className="text-xl font-semibold">
          Uh oh, looks like we couldn&apos;t import some songs. This is most
          likely due to an error in the file&apos;s encoding.
        </h4>
        <div className="mb-4">
          {errors?.map((songName, index) => (
            <div key={index} className="p-2 border-b last:border-0">
              {songName}
            </div>
          ))}
        </div>
        <Link to="/songs">
          <Button variant="outlined" full bold>
            Go to song library
          </Button>
        </Link>
      </div>
    );
  } else {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-center mb-4">
          Your songs have finished importing!
        </h2>
        <Link to="/songs">
          <Button variant="outlined" full bold>
            View songs
          </Button>
        </Link>
        <Button full bold className="mt-4" onClick={onReset}>
          Import again
        </Button>
      </div>
    );
  }
}
