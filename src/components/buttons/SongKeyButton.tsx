type SongKeyButtonProps = {
  /** A note name; '' is a disabled blank cell. */
  songKey: string;
  onClick: () => void;
  selected: boolean;
};

export default function SongKeyButton({
  songKey,
  onClick,
  selected,
}: SongKeyButtonProps) {
  return (
    <button
      className={
        `outline-hidden focus:outline-hidden col-span-1` +
        ` rounded-md hover:bg-gray-200 focus:bg-gray-200 transition-all` +
        ` py-2 font-semibold` +
        ` ${selected ? ' ring-blue-300 ring-4 ' : ''}` +
        ` ${
          songKey === ''
            ? ' dark:bg-dark-gray-400 bg-gray-200 cursor-pointer '
            : ' bg-gray-100 dark:bg-dark-gray-400 '
        }`
      }
      onClick={onClick}
      disabled={songKey === ''}
    >
      {songKey}
    </button>
  );
}
