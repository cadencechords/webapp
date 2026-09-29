import { DetailPlaceholder, DetailTile } from './SongDetailParts';

type LastScheduledFieldProps = {
  /** The latest past setlist with the song, and its formatted date. */
  latestSetlist?: { id: number; date: string };
};

export default function LastScheduledField({
  latestSetlist,
}: LastScheduledFieldProps) {
  return (
    <DetailTile
      label="Last scheduled"
      to={latestSetlist && `/sets/${latestSetlist.id}`}
    >
      {latestSetlist?.date ?? <DetailPlaceholder tile>Never</DetailPlaceholder>}
    </DetailTile>
  );
}
