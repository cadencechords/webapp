import { Link } from 'react-router-dom';
import ProfilePicture from '../components/ProfilePicture';
import Toggle from '../components/Toggle';
import { selectCurrentUser } from '../store/authSlice';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import useTheme from '../hooks/useTheme';
import Icon from '../components/Icon';
import type { OutlinedIconName } from '../components/icons/registry';
import { getNameOrEmail } from '../utils/model';
import {
  LIST_ITEM_INTERACTIVE,
  LIST_ITEM_TWO_LINE,
  LIST_SUPPORTING_TEXT,
} from '../components/lists/listItem';

// A row's leading icon, in the key badges' rounded square on
// secondary-container, then its headline and supporting text.
function RowText({
  icon,
  title,
  description,
}: {
  icon: OutlinedIconName;
  title: string;
  description: string;
}) {
  return (
    <>
      <span className="flex-center w-10 h-10 shrink-0 rounded-[12px] bg-secondary-container text-on-secondary-container">
        <Icon name={icon} className="w-6 h-6" />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-title-medium">{title}</div>
        <div className={LIST_SUPPORTING_TEXT}>{description}</div>
      </div>
    </>
  );
}

function LinkRow({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE}`}>
      {children}
      <Icon
        name="chevron_right"
        className="w-6 h-6 shrink-0 text-on-surface-variant"
      />
    </Link>
  );
}

export default function AccountDetailPage() {
  const currentUser = useSelector(selectCurrentUser);
  const { isDark, setIsDark } = useTheme();

  useEffect(() => {
    document.title = 'Account Details';
  }, []);

  if (!currentUser) return <>Loading...</>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col items-center gap-1 mb-6 font-plain">
        <div className="w-24 my-2 flex-center">
          <ProfilePicture
            url={currentUser.image_url}
            name={getNameOrEmail(currentUser)}
          />
        </div>
        {currentUser.first_name && (
          <div className="text-headline-small text-on-surface">
            {currentUser.first_name} {currentUser.last_name}
          </div>
        )}
        <div className="text-body-medium text-on-surface-variant">
          {currentUser.email}
        </div>
      </div>

      {/* M3 segmented list, like the songs list: each row its own segment. */}
      <div className="list-segmented">
        <LinkRow to="/account/settings">
          <RowText
            icon="settings"
            title="General"
            description="Integrations and signing out"
          />
        </LinkRow>
        <LinkRow to="/account/profile">
          <RowText
            icon="account_circle"
            title="Profile"
            description="Your name and picture"
          />
        </LinkRow>
        <LinkRow to="/account/notifications">
          <RowText
            icon="notifications"
            title="Notifications"
            description="What you're notified about, and how"
          />
        </LinkRow>
        <LinkRow to="/account/appearance">
          <RowText
            icon="image"
            title="Appearance"
            description="How songs look when you open them"
          />
        </LinkRow>
        {/* The whole row toggles the theme; the switch shows it. */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsDark(!isDark)}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setIsDark(!isDark);
            }
          }}
          className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE} cursor-pointer`}
        >
          <RowText
            icon="palette"
            title="Dark theme"
            description="Easier on the eyes in low light"
          />
          <Toggle enabled={isDark} />
        </div>
      </div>
    </div>
  );
}
