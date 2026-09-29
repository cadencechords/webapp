import { useRef, type ReactNode } from 'react';
import Button from './Button';
import Icon from './Icon';
import ImportStepHeader from './ImportStepHeader';

type OnsongChooseBackupFileProps = {
  onBackupFileChosen: (backup: File) => void;
  onReset: () => void;
  backup?: File | null;
  onChooseSongs: () => void;
};

// Step 1: how to export a backup from OnSong, as numbered steps on a card,
// then the button to choose it (choosing one moves on to its songs).
export default function OnsongChooseBackupFile({
  onBackupFileChosen,
  onReset,
  backup,
  onChooseSongs,
}: OnsongChooseBackupFileProps) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <>
      <ImportStepHeader step="Step 1 of 4" title="Choose your OnSong backup" />
      <section className="p-6 mb-6 rounded-extra-large-increased bg-surface-container-low text-on-surface font-plain">
        <h2 className="mb-3 text-title-medium">Export your library first</h2>
        <ol className="flex flex-col gap-3 text-body-medium">
          <Step number={1}>
            In OnSong, open Export.{' '}
            <a
              href="https://onsongapp.com/docs/interface/menubar/share-menu/export/"
              rel="noreferrer"
              className="text-primary underline"
              target="_blank"
            >
              How to export
            </a>
          </Step>
          <Step number={2}>Choose the OnSong Backup option.</Step>
          <Step number={3}>Choose the .backup file it saves, below.</Step>
        </ol>
      </section>

      <input
        className="hidden"
        // Non-null: a file input's `files` is never null.
        onChange={event => onBackupFileChosen(event.target.files![0])}
        type="file"
        accept=".backup"
        ref={input}
      />
      {backup ? (
        <div className="flex items-center gap-3 py-2 pl-4 pr-2 mb-6 rounded-full bg-surface-container-highest font-plain">
          <Icon
            name="upload_file"
            className="w-5 h-5 shrink-0 text-on-surface-variant"
          />
          <span className="flex-1 min-w-0 truncate text-body-medium">
            {backup.name}
          </span>
          <Button
            variant="icon"
            color="gray"
            size="md"
            name="Remove backup"
            onClick={() => {
              onReset();
              if (input.current) input.current.value = '';
            }}
          >
            <Icon name="close" className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        <Button
          variant="accent"
          color="gray"
          size="md"
          full
          className="flex-center gap-2 mb-6"
          onClick={() => input.current?.click()}
        >
          <Icon name="upload_file" className="w-6 h-6" />
          Choose backup file
        </Button>
      )}

      {backup && (
        <div className="flex justify-end">
          <Button
            size="md"
            className="w-full gap-2 flex-center sm:w-auto"
            onClick={onChooseSongs}
          >
            Choose songs
            <Icon name="arrow_forward" className="w-5 h-5" />
          </Button>
        </div>
      )}
    </>
  );
}

function Step({ number, children }: { number: number; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex-center shrink-0 w-6 h-6 rounded-full bg-primary-container text-on-primary-container text-label-medium">
        {number}
      </span>
      <span className="pt-0.5">{children}</span>
    </li>
  );
}
