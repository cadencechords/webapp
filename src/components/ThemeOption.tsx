import Checkbox from './Checkbox';
import type { Tag } from '../types';

type ThemeOptionProps = {
  theme: Tag;
  onToggle: (checked: boolean, theme: Tag) => void;
  selected?: boolean;
};

export default function ThemeOption({
  theme,
  onToggle,
  selected,
}: ThemeOptionProps) {
  const selectedClasses = ' ring-inset ring-2 ring-blue-400 ';

  const handleCheck = (checkValue: boolean) => {
    onToggle(checkValue, theme);
  };

  return (
    <div
      className={`rounded-md cursor-pointer flex items-center w-full text-left focus:outline-hidden outline-hidden py-2 px-3 ${
        selected ? selectedClasses : ''
      }`}
      onClick={() => handleCheck(!selected)}
    >
      <Checkbox onChange={handleCheck} checked={selected} />{' '}
      <span className="ml-4 flex items-center">{theme.name}</span>
    </div>
  );
}
