import { Link } from 'react-router-dom';
import Icon from '../Icon';

type AccountPageHeaderProps = {
  title: string;
};

/** An account page's header: a back button to the account menu and the
    page's title. */
export default function AccountPageHeader({ title }: AccountPageHeaderProps) {
  return (
    <div className="flex items-center gap-1 mb-4">
      <Link
        to="/account"
        aria-label="Back to account"
        // M3 standard icon button.
        className="flex-center w-10 h-10 -ml-2 rounded-[20px] [--shape-morph-to:8px] text-on-surface-variant state-layer-flat focus-ring shape-morph"
      >
        <Icon name="arrow_back" className="w-6 h-6" />
      </Link>
      <h1 className="text-headline-small-emphasized text-on-surface">
        {title}
      </h1>
    </div>
  );
}
