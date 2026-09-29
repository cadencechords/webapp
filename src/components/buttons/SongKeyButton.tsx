import classNames from 'classnames';

type SongKeyButtonProps = {
  /** A note name; '' is an empty cell, keeping the grid's columns. */
  songKey: string;
  onClick: () => void;
  selected: boolean;
};

// An M3E toggle button in the key grid: round on surface-container-highest,
// and primary with its corners tightened (12px) when selected, animated on
// the fast-spatial spring. An empty cell is a spacer, not a button.
export default function SongKeyButton({
  songKey,
  onClick,
  selected,
}: SongKeyButtonProps) {
  if (songKey === '') return <span aria-hidden="true" />;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={classNames(
        'flex-center h-12 font-plain text-title-medium state-layer-flat focus-ring transition-fast-spatial',
        selected
          ? 'rounded-[12px] bg-primary text-on-primary'
          : 'rounded-[24px] bg-surface-container-highest text-on-surface'
      )}
    >
      {songKey}
    </button>
  );
}
