import { useState } from 'react';
import classNames from 'classnames';
import AddCancelActions from './buttons/AddCancelActions';
import OutlinedInput from './inputs/OutlinedInput';
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
  return (
    <StyledDialog
      open={open}
      onCloseDialog={onCloseDialog}
      title="Choose the meter"
      fullscreen={false}
    >
      {/* StyledDialog unmounts its contents while closed, so each opening
          starts from the current meter. */}
      <MeterChooser
        onCloseDialog={onCloseDialog}
        meter={meter}
        onMeterChange={onMeterChange}
      />
    </StyledDialog>
  );
}

function MeterChooser({
  onCloseDialog,
  meter,
  onMeterChange,
}: Omit<MeterDialogProps, 'open'>) {
  // '6/8' → ['6', '8']; without a meter (or a malformed one), 4/4.
  const [initialNumerator, initialDenominator] = meter?.includes('/')
    ? meter.split('/')
    : ['4', '4'];
  const [numerator, setNumerator] = useState(initialNumerator);
  const [denominator, setDenominator] = useState(initialDenominator);

  const handleConfirm = () => {
    onMeterChange(numerator + '/' + denominator);
    onCloseDialog();
  };

  return (
    <>
      {/* The meter being picked, as a time signature. */}
      <div className="flex flex-col items-center mb-6 font-plain text-display-small text-primary leading-none">
        <span>{numerator || '–'}</span>
        <span>{denominator || '–'}</span>
      </div>

      {/* The common meters as M3E toggle buttons, stacked like the meter. */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {COMMON_METERS.map(common => {
          const selected =
            `${common.numerator}` === numerator &&
            `${common.denominator}` === denominator;
          return (
            <button
              key={`${common.numerator}/${common.denominator}`}
              type="button"
              aria-pressed={selected}
              aria-label={`${common.numerator}/${common.denominator}`}
              onClick={() => {
                setNumerator(`${common.numerator}`);
                setDenominator(`${common.denominator}`);
              }}
              className={classNames(
                'flex flex-col items-center justify-center h-16 font-plain text-title-medium leading-tight state-layer-flat focus-ring transition-fast-spatial',
                selected
                  ? 'rounded-[12px] bg-primary text-on-primary'
                  : 'rounded-[32px] bg-surface-container-highest text-on-surface'
              )}
            >
              <span>{common.numerator}</span>
              <span>{common.denominator}</span>
            </button>
          );
        })}
      </div>

      {/* Or any meter. */}
      <div className="grid grid-cols-2 gap-3">
        <OutlinedInput
          label="Beats"
          type="number"
          value={numerator}
          onChange={setNumerator}
        />
        <OutlinedInput
          label="Beat unit"
          type="number"
          value={denominator}
          onChange={setDenominator}
        />
      </div>

      <AddCancelActions
        addText="Confirm"
        onCancel={onCloseDialog}
        onAdd={handleConfirm}
        addDisabled={!numerator || !denominator}
      />
    </>
  );
}

const COMMON_METERS = [
  { numerator: 4, denominator: 4 },
  { numerator: 3, denominator: 4 },
  { numerator: 2, denominator: 2 },
  { numerator: 6, denominator: 8 },
  { numerator: 12, denominator: 8 },
];
