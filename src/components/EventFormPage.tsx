import { Link } from 'react-router-dom';
import Alert from './Alert';
import Button from './Button';
import EventForm from './EventForm';
import Icon from './Icon';

type EventFormPageProps = {
  title: string;
  canSave: boolean;
  saving: boolean;
  saveFailed: boolean;
  onSave: () => void;
};

// Creating or editing an event: a header with a back icon button, the title
// and Save (a filled button), over the form.
export default function EventFormPage({
  title,
  canSave,
  saving,
  saveFailed,
  onSave,
}: EventFormPageProps) {
  return (
    <div className="container max-w-3xl">
      <div className="flex items-center gap-1 mb-4 -ml-2">
        <Link
          to="/calendar"
          aria-label="Back to calendar"
          className="flex-center w-12 h-12 shrink-0 rounded-full text-on-surface-variant state-layer-flat focus-ring"
        >
          <Icon name="arrow_back" className="w-6 h-6" />
        </Link>
        <h1 className="flex-1 min-w-0 truncate text-headline-small-emphasized font-plain text-on-surface">
          {title}
        </h1>
        <Button disabled={!canSave} onClick={onSave} loading={saving}>
          Save
        </Button>
      </div>
      {saveFailed && (
        <div className="mb-6">
          <Alert color="red">
            The event couldn&apos;t be saved. Please try again.
          </Alert>
        </div>
      )}
      <EventForm />
    </div>
  );
}
