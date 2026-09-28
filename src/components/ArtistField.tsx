import {
  DetailPlaceholder,
  DetailTile,
  TILE_TEXTAREA,
} from './SongDetailParts';

type ArtistFieldProps = {
  onChange: (artist: string) => void;
  artist?: string;
  editable?: boolean;
};

export default function ArtistField({
  onChange,
  artist,
  editable,
}: ArtistFieldProps) {
  return (
    <DetailTile label="Artist" input={editable} wrap>
      {editable ? (
        // A one-line textarea, so a long name wraps; Enter doesn't add a line.
        <textarea
          rows={1}
          className={TILE_TEXTAREA}
          value={artist ?? ''}
          onChange={e => onChange(e.target.value.replace(/\n/g, ' '))}
          onKeyDown={e => {
            if (e.key === 'Enter') e.preventDefault();
          }}
          placeholder="Add"
        />
      ) : (
        artist || <DetailPlaceholder tile>None</DetailPlaceholder>
      )}
    </DetailTile>
  );
}
