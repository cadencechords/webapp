import { useRef, useState } from 'react';

type RoadmapSectionProps = {
  section: string;
  /** Not read; RoadmapDragDopContext doesn't pass it either. */
  color?: string;
  onChange?: (value: string) => void;
  onDelete?: () => void;
};

export default function RoadmapSection({
  section,
  color,
  onChange,
  onDelete,
}: RoadmapSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  function determineWidth() {
    return section.length + 3 + 'ch';
  }

  // The input's own key handler, so ref.current is that input.
  function handleKeyDown(key: string) {
    if (key === 'Backspace' && section === '') {
      ref.current!.blur();
      // Only the drag clone has no onDelete, and it isn't edited.
      onDelete!();
    }
    if (key === 'Enter') ref.current!.blur();
  }

  function handleClick() {
    setIsEditing(true);
    setTimeout(() => {
      ref.current?.select();
    }, 50);
  }

  return isEditing ? (
    <input
      ref={ref}
      value={section || ''}
      onChange={e => onChange?.(e.target.value)}
      // The chip being edited: on the surface, outlined in primary.
      className="h-8 px-3 bg-surface border-2 rounded-small border-primary outline-hidden font-plain text-label-large text-on-surface caret-primary"
      style={{ width: determineWidth() }}
      onBlur={() => setIsEditing(false)}
      onKeyDown={e => handleKeyDown(e.key)}
    />
  ) : (
    <div
      onClick={handleClick}
      // A tonal chip: secondary-container, small corners, label-large.
      className="h-8 px-3 flex-center whitespace-nowrap rounded-small bg-secondary-container text-on-secondary-container font-plain text-label-large cursor-pointer state-layer-flat"
    >
      {section}
    </div>
  );
}
