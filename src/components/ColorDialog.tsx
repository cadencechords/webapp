import Button from './Button';
import DialogActions from './DialogActions';
import ColorSwatches from './ColorSwatches';
import StyledDialog from './StyledDialog';
import { useState } from 'react';

type ColorDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  /** The binder's color, a key of `COLORS` (or unset). */
  binderColor?: string;
  /** Called on confirm with the picked color (`binderColor` if none was picked). */
  onChange: (color: string | undefined) => void;
};

export default function ColorDialog({
  open,
  onCloseDialog,
  binderColor,
  onChange,
}: ColorDialogProps) {
  const [currentColor, setCurrentColor] = useState(binderColor);

  const handleUpdate = () => {
    onChange(currentColor);
    onCloseDialog();
  };

  return (
    <StyledDialog
      open={open}
      onCloseDialog={onCloseDialog}
      title="Choose a color for your folder"
      fullscreen={false}
    >
      <ColorSwatches color={currentColor} onChange={setCurrentColor} />

      <DialogActions>
        <Button variant="open" color="gray" size="sm" onClick={onCloseDialog}>
          Cancel
        </Button>
        <Button variant="open" size="sm" onClick={handleUpdate}>
          Confirm
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
