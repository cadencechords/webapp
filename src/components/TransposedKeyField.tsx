import { getHalfStepHigher, getHalfStepLower } from '../utils/SongUtils';

import Button from './Button';
import DetailTitle from './DetailTitle';
import EditableData from './inputs/EditableData';
import KeyTransposerDialog from './KeyTransposerDialog';
import { useState } from 'react';
import Icon from './Icon';

export default function TransposedKeyField({
  transposedKey,
  originalKey,
  onChange,
  content,
  editable,
}) {
  const [showKeyTransposerDialog, setShowKeyTransposerDialog] = useState(false);

  const handleKeyChange = newKey => {
    onChange(newKey);
    setShowKeyTransposerDialog(false);
  };

  const handleTransposeUpHalfKey = () => {
    onChange(getHalfStepHigher(transposedKey || originalKey));
  };

  const handleTransposeDownHalfKey = () => {
    onChange(getHalfStepLower(transposedKey || originalKey));
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
