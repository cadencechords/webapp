import DetailTitle from './DetailTitle';
import EditableData from './inputs/EditableData';
import KeyChooserDialog from './KeyChooserDialog';
import { useState } from 'react';

type SongKeyFieldProps = {
  songKey?: string;
  onChange: (key: string) => void;
  editable?: boolean;
};

export default function SongKeyField({
  songKey,
  onChange,
  editable,
}: SongKeyFieldProps) {
  const [showKeyChooserDialog, setShowKeyChooserDialog] = useState(false);

  const handleKeyChange = (newKey: string) => {
    onChange(newKey);
    setShowKeyChooserDialog(false);
  };

  return (
    <div className="flex flex-row items-center mb-1">
      <DetailTitle>Key:</DetailTitle>
      <EditableData
        value={songKey || ''}
        onChange={() => null}
        placeholder="Add the key"
        onClick={() => setShowKeyChooserDialog(true)}
        editable={editable}
      />

      <KeyChooserDialog
        open={showKeyChooserDialog}
        onCloseDialog={() => setShowKeyChooserDialog(false)}
        currentSongKey={songKey}
        onChange={handleKeyChange}
      />
    </div>
  );
}
