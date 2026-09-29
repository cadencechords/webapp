import { Link } from 'react-router-dom';
import Button, { buttonClasses } from '../Button';
import Icon from '../Icon';

type CalendarHeaderProps = {
  /** The month and year shown, e.g. `'May 2024'`. */
  title: string;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  /** Shows a Today button that goes back to this month. */
  onToday?: () => void;
  /** Shows the "New event" button. */
  canCreate?: boolean;
};

const WEEKDAYS = [
  ['Su', 'Sunday'],
  ['Mo', 'Monday'],
  ['Tu', 'Tuesday'],
  ['We', 'Wednesday'],
  ['Th', 'Thursday'],
  ['Fr', 'Friday'],
  ['Sa', 'Saturday'],
];

// The month and year as the page's title, previous and next as standard
// icon buttons, Today (outlined) and New event (filled), over the weekday
// names in label-medium.
export default function CalendarHeader({
  title,
  onNextMonth,
  onPreviousMonth,
  onToday,
  canCreate,
}: CalendarHeaderProps) {
  const iconButton =
    'flex-center w-10 h-10 shrink-0 rounded-full text-on-surface-variant state-layer-flat focus-ring';

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="flex items-center flex-1 min-w-0 gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={onPreviousMonth}
            className={iconButton}
          >
            <Icon name="chevron_left" className="w-6 h-6" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={onNextMonth}
            className={iconButton}
          >
            <Icon name="chevron_right" className="w-6 h-6" />
          </button>
          <h1 className="ml-2 truncate font-plain text-headline-small-emphasized text-on-surface">
            {title}
          </h1>
        </div>
        {onToday && (
          <Button variant="outlined" size="sm" onClick={onToday}>
            Today
          </Button>
        )}
        {canCreate && (
          <Link
            to="/calendar/new"
            className={buttonClasses({
              size: 'sm',
              className: 'flex-center gap-2 whitespace-nowrap',
            })}
          >
            <Icon name="add" className="w-5 h-5" />
            New event
          </Link>
        )}
      </div>
      <div className="grid grid-cols-7 mb-2 text-center font-plain text-label-medium text-on-surface-variant">
        {WEEKDAYS.map(([short, full]) => (
          <abbr key={full} title={full} className="no-underline">
            {short}
          </abbr>
        ))}
      </div>
    </>
  );
}
