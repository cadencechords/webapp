type KeyBadgeProps = {
  /** Nothing renders without a key. */
  songKey?: string;
};

// The song's key on secondary-container in the M3 Expressive "square"
// shape (9px corners at its 22px height). It's as wide as its key plus 4px
// each side, and at least square, so one-letter keys stay square.
export default function KeyBadge({ songKey }: KeyBadgeProps) {
  if (!songKey) return null;
  return (
    <span className="inline-flex items-center justify-center shrink-0 grow-0 min-w-[22px] h-[22px] px-1 ml-2 rounded-[9px] bg-secondary-container font-plain text-label-small-emphasized tracking-tight text-on-secondary-container">
      {songKey}
    </span>
  );
}
