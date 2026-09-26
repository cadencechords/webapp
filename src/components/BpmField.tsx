import DetailTitle from './DetailTitle';
import EditableData from './inputs/EditableData';

type BpmFieldProps = {
  /** A number from the API, or the edited string. */
  bpm?: number | string;
  onChange: (bpm: string) => void;
  editable?: boolean;
};

export default function BpmField({ bpm, onChange, editable }: BpmFieldProps) {
  return (
    <div className="flex flex-row items-center mb-1">
      <DetailTitle>BPM:</DetailTitle>
      <EditableData
        value={bpm ? bpm : ''}
        onChange={onChange}
        placeholder="Add bpm"
        editable={editable}
      />
    </div>
  );
}
