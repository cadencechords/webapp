type KeyBadgeProps = {
  /** Nothing renders without a key. */
  songKey?: string;
};

export default function KeyBadge({ songKey }: KeyBadgeProps) {
  if (songKey) {
    return (
      // An outlined M3 chip, sized to sit inline in a list row.
      <span className="inline-flex items-center shrink-0 grow-0 h-6 px-2 ml-2 rounded-small border border-outline-variant font-plain text-label-medium text-on-surface-variant">
        {songKey}
      </span>
    );
  } else {
    return null;
  }
}
