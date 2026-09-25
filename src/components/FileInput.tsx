import { useRef, useState, type ChangeEvent } from 'react';

import Button from './Button';
import Icon from './Icon';

type FileInputProps = {
  onChange: (file: File) => void;
  accept?: string;
  onRemove: () => void;
};

export default function FileInput({
  onChange,
  accept = '',
  onRemove,
}: FileInputProps) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>();

  const handleFileChosen = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files[0];
    onChange(uploadedFile);
    setFile(uploadedFile);
  };

  const handleClick = () => {
    input.current?.click();
  };

  const handleRemoveChosenFile = () => {
    setFile(null);
    onRemove();
    if (input.current) input.current.value = '';
  };

  return (
    <>
      <input
        className="hidden"
        onChange={handleFileChosen}
        type="file"
        accept={accept}
        ref={input}
      />
      <Button full onClick={handleClick}>
        Choose file
      </Button>
      {file && (
        <div className="flex-between border rounded-md p-3 mt-4">
          {file.name}
          <Button size="xs" variant="open" onClick={handleRemoveChosenFile}>
            <Icon name="close" className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
      )}
    </>
  );
}
