import { useRef, useState, type ChangeEvent } from 'react';

import LinearProgress from './feedback/LinearProgress';
import Button from './Button';
import FilesApi from '../api/filesApi';
import { reportError } from '../utils/error';
import { useParams } from 'react-router';
import Icon from './Icon';
import type { SongFile } from '../types';

type SongFileUploadProps = {
  onFilesUploaded?: (files: SongFile[]) => void;
};

export default function SongFileUpload({
  onFilesUploaded,
}: SongFileUploadProps) {
  const [filesBeingUploaded, setFilesBeingUploaded] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { id } = useParams<{ id: string }>();

  async function handleFilesSelected(e: ChangeEvent<HTMLInputElement>) {
    // Non-null: a file input's change event always has its files.
    const files = Object.values(e.target.files!);
    setFilesBeingUploaded(files);
    try {
      const { data } = await FilesApi.addFilesToSong(id, files);
      setFilesBeingUploaded([]);
      onFilesUploaded?.(data);
    } catch (error) {
      reportError(error);
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        {/* An M3E small tonal button (tertiary) with a leading icon. */}
        <Button
          variant="accent"
          color="purple"
          size="sm"
          className="flex-center gap-2"
          // Non-null: the input is always rendered.
          onClick={() => inputRef.current!.click()}
        >
          <Icon name="note_add" className="w-5 h-5" />
          Add file
        </Button>
        <input
          type="file"
          hidden
          ref={inputRef}
          onChange={handleFilesSelected}
          multiple
        />
      </div>
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${
          filesBeingUploaded?.length > 0 ? 'mb-4' : ''
        }`}
      >
        {filesBeingUploaded?.map((file, index) => (
          <div
            key={index}
            className="relative overflow-hidden border border-outline-variant rounded-medium px-3 pt-3 pb-2 text-body-medium text-on-surface"
          >
            <LinearProgress className="absolute top-0 inset-x-0" />
            {file.name}
          </div>
        ))}
      </div>
    </>
  );
}
