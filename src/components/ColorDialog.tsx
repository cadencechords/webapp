import BinderColor from './BinderColor';
import Button from './Button';
import { COLORS } from '../utils/BinderUtils';
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
      title="Choose a color for your binder"
      fullscreen={false}
    >
      <div className="grid grid-cols-5 gap-6 mb-4">
        {COLORS.map((color, index) => (
          <BinderColor color={color} onClick={setCurrentColor} key={index} />
        ))}
      </div>

      <div>Current color:</div>
      <BinderColor color={currentColor} block />

      <div className="mt-4">
        <Button variant="open" color="blue" full onClick={handleUpdate}>
          Confirm
        </Button>
      </div>
    </StyledDialog>
  );
}
