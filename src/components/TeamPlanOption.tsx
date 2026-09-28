import classNames from 'classnames';
import type { ReactNode } from 'react';

type TeamPlanOptionProps = {
  selected: boolean;
  onClick: (name: string) => void;
  name: string;
  className?: string;
  trialMessage: ReactNode;
  pricing: ReactNode;
};

// A plan as a selectable card in a radiogroup: surface-container, or
// primary-container once picked, with a primary outline set 3px out from
// the card.
export default function TeamPlanOption({
  selected,
  onClick,
  name,
  className,
  trialMessage,
  pricing,
}: TeamPlanOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onClick(name)}
      className={classNames(
        'block w-full px-5 py-4 text-left rounded-extra-large font-plain outline-2 outline-offset-3 state-layer-flat focus-ring transition-fast-effects',
        selected
          ? 'bg-primary-container text-on-primary-container outline-solid outline-primary'
          : 'bg-surface-container text-on-surface outline-transparent',
        className
      )}
    >
      <div className="text-title-medium">{name}</div>
      <div className="mt-1 text-headline-small">{pricing}</div>
      <span className="inline-block mt-2 px-2 py-0.5 rounded-small border border-current text-label-medium">
        {trialMessage}
      </span>
    </button>
  );
}
