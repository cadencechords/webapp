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
      className={`bg-white dark:bg-dark-gray-800 focus:outline-hidden outline-hidden border dark:border-dark-gray-400 rounded-md px-1.5 text-sm h-9`}
      style={{ width: determineWidth() }}
      onBlur={() => setIsEditing(false)}
      onKeyDown={e => handleKeyDown(e.key)}
    />
  ) : (
    <div
      onClick={handleClick}
      className={`px-2 bg-white whitespace-nowrap dark:bg-dark-gray-900 focus:outline-hidden outline-hidden border dark:border-dark-gray-400 rounded-md text-sm h-9 flex-center`}
    >
      {section}
    </div>
  );
}
