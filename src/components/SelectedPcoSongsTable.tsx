import Checkbox from './Checkbox';
import Table from './Table';

/** A Planning Center song picked for import. */
type PcoSong = {
  title?: string;
  author?: string;
};

type SelectedPcoSongsTableProps<T extends PcoSong> = {
  songsToImport?: T[];
  onRemove: (song: T) => void;
};

const HEADERS = ['', 'TITLE', 'AUTHOR'];
export default function SelectedPcoSongsTable<T extends PcoSong>({
  songsToImport = [],
  onRemove,
}: SelectedPcoSongsTableProps<T>) {
  const songRows = songsToImport.map(song => ({
    checkbox: <Checkbox checked={true} onChange={() => onRemove(song)} />,
    title: song.title,
    author: song.author,
  }));

  return <Table headers={HEADERS} rows={songRows} />;
}
