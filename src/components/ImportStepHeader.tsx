import { Link } from 'react-router-dom';
import Icon from './Icon';

type ImportStepHeaderProps = {
  /** "Step 1 of 2", above the title. */
  step: string;
  title: string;
  /** Under the title, like where the songs come from. */
  subtitle?: string;
  /** Goes back a step; without it, back leads to the import sources. */
  onBack?: () => void;
  backLabel?: string;
};

// An import step's header: a back icon button, then the step, the title in
// headline-small and an optional subtitle.
export default function ImportStepHeader({
  step,
  title,
  subtitle,
  onBack,
  backLabel = 'Back to import sources',
}: ImportStepHeaderProps) {
  const backClasses =
    'flex-center shrink-0 w-10 h-10 -ml-2 rounded-[20px] [--shape-morph-to:8px] text-on-surface-variant state-layer-flat focus-ring shape-morph';
  const back = <Icon name="arrow_back" className="w-6 h-6" />;

  return (
    <div className="flex items-start gap-2 mb-6 font-plain">
      {onBack ? (
        <button
          type="button"
          aria-label={backLabel}
          onClick={onBack}
          className={backClasses}
        >
          {back}
        </button>
      ) : (
        <Link to="/import" aria-label={backLabel} className={backClasses}>
          {back}
        </Link>
      )}
      <div className="min-w-0 pt-0.5">
        <div className="text-label-large text-primary">{step}</div>
        <h1 className="text-headline-small-emphasized text-on-surface">
          {title}
        </h1>
        {subtitle && (
          <p className="text-body-medium text-on-surface-variant">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
