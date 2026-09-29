import { DetailPlaceholder, DetailTile } from './SongDetailParts';
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
    <>
      <DetailTile
        label="Key"
        onClick={editable ? () => setShowKeyChooserDialog(true) : undefined}
      >
        {songKey || (
          <DetailPlaceholder tile>
            {editable ? 'Add' : 'None'}
          </DetailPlaceholder>
        )}
      </DetailTile>
      <KeyChooserDialog
        open={showKeyChooserDialog}
        onCloseDialog={() => setShowKeyChooserDialog(false)}
        currentSongKey={songKey}
        onChange={handleKeyChange}
      />
    </>
  );
}
