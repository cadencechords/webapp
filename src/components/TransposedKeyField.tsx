import { getHalfStepHigher, getHalfStepLower } from '../utils/SongUtils';

import Button from './Button';
import DetailTitle from './DetailTitle';
import EditableData from './inputs/EditableData';
import KeyTransposerDialog from './KeyTransposerDialog';
import { useState } from 'react';
import Icon from './Icon';

type TransposedKeyFieldProps = {
  transposedKey?: string;
  originalKey?: string;
  onChange: (key: string) => void;
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

  const handleKeyChange = (newKey: string) => {
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
    <div className="flex flex-row items-center mb-1">
      <DetailTitle>Transposed:</DetailTitle>
      <EditableData
        value={transposedKey ? transposedKey : ''}
        onChange={() => null}
        placeholder="Click to transpose"
        onClick={() => setShowKeyTransposerDialog(true)}
        editable={editable}
      />
      <Button
        size="sm"
        variant="icon"
        disabled={!originalKey}
        onClick={handleTransposeUpHalfKey}
        className="mr-1"
      >
        <Icon name="add" className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="icon"
        disabled={!originalKey}
        onClick={handleTransposeDownHalfKey}
      >
        <Icon name="remove" className="w-4 h-4" />
      </Button>
      <KeyTransposerDialog
        open={showKeyTransposerDialog}
        onCloseDialog={() => setShowKeyTransposerDialog(false)}
        originalKey={originalKey}
        transposedKey={transposedKey}
        onChange={handleKeyChange}
        content={content}
      />
    </div>
  );
}
