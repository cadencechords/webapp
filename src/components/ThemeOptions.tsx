import ThemeOption from './ThemeOption';
import type { Tag } from '../types';

type ThemeOptionsProps = {
  themes: Tag[];
  onToggle: (checked: boolean, theme: Tag) => void;
  selectedThemes?: Tag[];
};

export default function ThemeOptions({
  themes,
  onToggle,
  selectedThemes,
}: ThemeOptionsProps) {
  return (
    <div className="grid grid-flow-row grid-cols-2 gap-x-5 gap-y-2 my-4 max-h-80 sm:max-h-64 overflow-y-auto mb-10 sm:mb-4">
      {themes.map(theme => (
        <div key={theme.id}>
          <ThemeOption
            theme={theme}
            onToggle={onToggle}
            selected={selectedThemes?.includes(theme)}
          />
        </div>
      ))}
    </div>
  );
}
