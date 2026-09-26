import DetailTitle from './DetailTitle';
import EditableData from './inputs/EditableData';
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
      <div className="flex flex-row items-center mb-1">
        <DetailTitle>Meter:</DetailTitle>
        <EditableData
          value={meter ? meter : ''}
          onClick={() => setShowDialog(true)}
          placeholder="ex: 4/4"
          editable={editable}
        />
      </div>
      <MeterDialog
        open={showDialog}
        onCloseDialog={() => setShowDialog(false)}
        onMeterChange={onChange}
        meter={meter}
      />
    </>
  );
}
