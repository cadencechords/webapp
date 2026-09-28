import { getHalfStepHigher, getHalfStepLower } from '../utils/SongUtils';

import Button from './Button';
import { DetailPlaceholder, DetailTile } from './SongDetailParts';
import KeyTransposerDialog from './KeyTransposerDialog';
import { useState } from 'react';
import Icon from './Icon';

type TransposedKeyFieldProps = {
  transposedKey?: string;
  originalKey?: string;
  onChange: (key: string | null) => void;
  /** The song's content, previewed in the transposer. */
  content?: string;
  editable?: boolean;
};

export default function TransposedKeyField({
  transposedKey,
  originalKey,
  onChange,
  content,
  editable,
}: TransposedKeyFieldProps) {
  const [showKeyTransposerDialog, setShowKeyTransposerDialog] = useState(false);

  const handleKeyChange = (newKey: string | null) => {
    onChange(newKey);
    setShowKeyTransposerDialog(false);
  };

  const handleTransposeUpHalfKey = () => {
    // The half-step buttons are disabled without an original key.
    onChange(getHalfStepHigher((transposedKey || originalKey) as string));
  };

  const handleTransposeDownHalfKey = () => {
    // The half-step buttons are disabled without an original key.
    onChange(getHalfStepLower((transposedKey || originalKey) as string));
  };

  return (
    <>
      <DetailTile
        label="Transposed"
        onClick={editable ? () => setShowKeyTransposerDialog(true) : undefined}
        actions={
          editable && (
            <>
              <Button
                size="sm"
                variant="icon"
                name="Transpose down a half step"
                disabled={!originalKey}
                onClick={handleTransposeDownHalfKey}
              >
                <Icon name="remove" className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="icon"
                name="Transpose up a half step"
                disabled={!originalKey}
                onClick={handleTransposeUpHalfKey}
              >
                <Icon name="add" className="w-5 h-5" />
              </Button>
            </>
          )
        }
      >
        {transposedKey || <DetailPlaceholder tile>None</DetailPlaceholder>}
      </DetailTile>
      <KeyTransposerDialog
        open={showKeyTransposerDialog}
        onCloseDialog={() => setShowKeyTransposerDialog(false)}
        originalKey={originalKey}
        transposedKey={transposedKey}
        onChange={handleKeyChange}
        content={content}
      />
    </>
  );
}
