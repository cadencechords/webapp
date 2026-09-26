import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';

import Button from './Button';
import Icon from './Icon';

type FilesInputProps = {
  /** Called with every file chosen, replacing the earlier choice. */
  onChange: (files: File[]) => void;
  onRemove: (file: File) => void;
  /** The input's `accept`, e.g. `'.pdf,.txt'`. */
  accept?: string;
  buttonText?: ReactNode;
};

export default function FilesInput({
  onChange,
  onRemove,
  accept,
  buttonText,
}: FilesInputProps) {
  const input = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  function handleFilesChosen(e: ChangeEvent<HTMLInputElement>) {
    // Non-null: a file input's change event always has its files.
    const filesArray = Object.values(e.target.files!);
    setFiles(filesArray);
    onChange(filesArray);
  }

  function handleRemove(fileToRemove: File) {
    setFiles(currentFiles => {
      const updatedFilesList = currentFiles?.filter(
        file => file !== fileToRemove
      );

      // Non-null: the input is always rendered.
      if (updatedFilesList?.length === 0) input.current!.value = '';

      return updatedFilesList;
    });

    onRemove(fileToRemove);
  }

  return (
    <div>
      <input
        accept={accept}
        multiple
        ref={input}
        type="file"
        hidden
        onChange={handleFilesChosen}
      />
      {files?.length === 0 && (
        <Button full onClick={() => input.current!.click()}>
          {buttonText}
        </Button>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 my-8">
        {files.map((file, index) => (
          <div
            key={index}
            className="p-3 border dark:border-dark-gray-600 rounded-md flex-between text-sm"
          >
            {file.name}
            <Button
              variant="open"
              size="xs"
              className="ml-3"
              onClick={() => handleRemove(file)}
            >
              <Icon name="delete" className="w-4 h-4 text-gray-500 shrink-0" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
