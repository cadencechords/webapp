import { DetailPlaceholder, DetailTile } from './SongDetailParts';
import MeterDialog from './MeterDialog';
import { useState } from 'react';

type MeterFieldProps = {
  /** Such as `'4/4'`. */
  meter?: string;
  onChange: (meter: string) => void;
  editable?: boolean;
};

export default function MeterField({
  meter,
  onChange,
  editable,
}: MeterFieldProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <DetailTile
        label="Meter"
        onClick={editable ? () => setShowDialog(true) : undefined}
      >
        {meter || (
          <DetailPlaceholder tile>
            {editable ? 'Add' : 'None'}
          </DetailPlaceholder>
        )}
      </DetailTile>
      <MeterDialog
        open={showDialog}
        onCloseDialog={() => setShowDialog(false)}
        onMeterChange={onChange}
        meter={meter}
      />
    </>
  );
}
