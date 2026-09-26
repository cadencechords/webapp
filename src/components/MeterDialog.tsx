import { useEffect, useState } from 'react';
import Button from './Button';
import AddCancelActions from './buttons/AddCancelActions';
import EditableData from './inputs/EditableData';
import StyledDialog from './StyledDialog';

type MeterDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  /** Such as `'4/4'`. */
  meter?: string;
  onMeterChange: (meter: string) => void;
};

export default function MeterDialog({
  open,
  onCloseDialog,
  meter,
  onMeterChange,
}: MeterDialogProps) {
  // EditableData hands back strings, so these hold strings after an edit.
  const [numerator, setNumerator] = useState<number | string>(4);
  const [denominator, setDenominator] = useState<number | string>(4);

  const handleChooseCommonMeter = (num: number, denom: number) => {
    setNumerator(num);
    setDenominator(denom);
  };

  const handleConfirm = () => {
    onMeterChange(numerator + '/' + denominator);
    onCloseDialog();
  };

  useEffect(() => {
    // Kept as before: with no meter, `undefined >= 3` is false and skips this.
    // TypeScript doesn't narrow `meter` from the length check, hence the `!`s:
    // the check passing means meter is set.
    if ((meter?.length as number) >= 3) {
      const indexOfSlash = meter!.indexOf('/');

      setNumerator(meter!.substring(0, indexOfSlash));
      setDenominator(meter!.charAt(meter!.length - 1));
    }
  }, [meter, open]);

  return (
    <StyledDialog
      open={open}
      onCloseDialog={onCloseDialog}
      title="Choose the meter"
      borderedTop={false}
      fullscreen={false}
    >
      <div>
        <h4 className="mb-2">Common meters:</h4>
        <div className="flex-between">
          {COMMON_METERS.map((meter, index) => {
            return (
              <Button
                variant="open"
                color="black"
                key={index}
                size="sm"
                className="flex-col leading-tight flex-center"
                style={{ borderRadius: '10px' }}
                onClick={() =>
                  handleChooseCommonMeter(meter.numerator, meter.denominator)
                }
              >
                <span>{meter.numerator}</span>
                <span>{meter.denominator}</span>
              </Button>
            );
          })}
        </div>
      </div>
      <h2 className="w-16 mx-auto mt-4 mb-8 text-center">
        <EditableData
          value={numerator}
          className="py-0 font-bold sm:text-5xl"
          centered
          onChange={newNumerator => setNumerator(newNumerator)}
          type="number"
        />
        <EditableData
          value={denominator}
          className="py-0 font-bold sm:text-5xl"
          centered
          onChange={newDenominator => setDenominator(newDenominator)}
          type="number"
        />
      </h2>
      <AddCancelActions
        addText="Confirm"
        onCancel={onCloseDialog}
        onAdd={handleConfirm}
      />
    </StyledDialog>
  );
}

const COMMON_METERS = [
  { numerator: 4, denominator: 4 },
  { numerator: 3, denominator: 4 },
  { numerator: 2, denominator: 2 },
  { numerator: 6, denominator: 8 },
  { numerator: 12, denominator: 8 },
];
