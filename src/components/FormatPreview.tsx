import { html } from '../utils/SongUtils';
import classNames from 'classnames';
import Icon from './Icon';
import type { FormatPreset } from '../types';

type FormatPreviewProps = {
  format: FormatPreset;
  selected: boolean;
  /** The preset clicked, or null when the selected one is clicked again. */
  onChange: (format: FormatPreset | null) => void;
  disabled?: boolean;
};

export default function FormatPreview({
  format,
  selected,
  onChange,
  disabled,
}: FormatPreviewProps) {
  return (
    // An M3E selectable card: the preview on a large-cornered surface, with
    // a primary outline and a Default pill when it's the team's default.
    <button
      type="button"
      className="shrink-0 text-left w-80 font-plain group disabled:cursor-default"
      onClick={() => onChange(selected ? null : format)}
      disabled={disabled}
      aria-pressed={selected}
    >
      <div
        className={classNames(
          'p-4 mb-2 relative overflow-y-hidden rounded-extra-large h-96 bg-surface-container-low text-on-surface outline-offset-2 transition-fast-effects',
          selected
            ? 'outline-3 outline-solid outline-primary'
            : 'group-enabled:group-hover:bg-surface-container'
        )}
      >
        {html({ content: testContent, format })}
        {selected && (
          <span className="absolute inline-flex items-center gap-1 h-7 px-3 top-4 right-4 rounded-full bg-primary text-on-primary text-label-large">
            <Icon name="check" className="w-4 h-4" />
            Default
          </span>
        )}
      </div>
      <div className="text-title-small text-center text-on-surface">
        {format.name}
      </div>
    </button>
  );
}

const testContent = `[Refrain]
 G      G7          
 Amazing Grace! 
     C         G
How sweet the sound
                         D
That saved a wretch like me!
  G        G7   
I once was lost, 
     C      G
But now am found,
    Em         D     G
Was blind, but now I see.`;
