import { DetailPlaceholder, DetailTile, TILE_INPUT } from './SongDetailParts';

type BpmFieldProps = {
  /** A number from the API, or the edited string. */
  bpm?: number | string;
  onChange: (bpm: string) => void;
  editable?: boolean;
};

export default function BpmField({ bpm, onChange, editable }: BpmFieldProps) {
  return (
    <DetailTile label="BPM" input={editable}>
      {editable ? (
        <input
          className={TILE_INPUT}
          value={bpm ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder="Add"
          inputMode="numeric"
        />
      ) : (
        bpm || <DetailPlaceholder tile>None</DetailPlaceholder>
      )}
    </DetailTile>
  );
}
