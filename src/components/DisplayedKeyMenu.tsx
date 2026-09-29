import MenuSelect from './MenuSelect';

type DisplayedKeyMenuProps = {
  options: { value: string; display: string }[];
  /** Unset until the page picks one from the song. */
  selected?: string;
  onChange: (value: string) => void;
};

/** Which key a song's chords show in. */
export default function DisplayedKeyMenu(props: DisplayedKeyMenuProps) {
  return <MenuSelect label="Key:" {...props} />;
}
