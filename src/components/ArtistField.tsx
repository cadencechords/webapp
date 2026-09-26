import DetailTitle from './DetailTitle';
import EditableData from './inputs/EditableData';

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
    <div className="flex flex-row items-center mb-1">
      <DetailTitle>Artist:</DetailTitle>
      <EditableData
        value={artist ? artist : ''}
        onChange={onChange}
        placeholder="Add an artist"
        editable={editable}
      />
    </div>
  );
}
