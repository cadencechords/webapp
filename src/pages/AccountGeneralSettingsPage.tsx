import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Integrations from '../components/Integrations';
import ProfilePicture from '../components/ProfilePicture';
import SignOutOptions from '../components/SignOutOptions';
import Icon from '../components/Icon';
import AccountPageHeader from '../components/settings/AccountPageHeader';
import { selectCurrentUser } from '../store/authSlice';
import { getNameOrEmail } from '../utils/model';
import {
  LIST_ITEM_INTERACTIVE,
  LIST_ITEM_TWO_LINE,
  LIST_SUPPORTING_TEXT,
} from '../components/lists/listItem';

// The account's general settings, in M3E: a back button and title, who's
// signed in (a row that opens their profile), then integrations and the
// account's sign-out options as segmented lists.
export default function AccountGeneralSettingsPage() {
  const currentUser = useSelector(selectCurrentUser);
  if (!currentUser) return <>Loading...</>;
  const hasName = !!currentUser.first_name;

  return (
    <div className="max-w-2xl mx-auto font-plain">
      <AccountPageHeader title="General" />

      <div className="mb-8 list-segmented">
        <Link
          to="/account/profile"
          className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE}`}
        >
          <ProfilePicture
            url={currentUser.image_url}
            name={getNameOrEmail(currentUser)}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <div className="truncate text-title-medium">
              {hasName
                ? `${currentUser.first_name} ${currentUser.last_name}`
                : 'Add your name'}
            </div>
            <div className={`truncate ${LIST_SUPPORTING_TEXT}`}>
              {currentUser.email}
            </div>
          </div>
          <Icon
            name="chevron_right"
            className="w-6 h-6 shrink-0 text-on-surface-variant"
          />
        </Link>
      </div>

      <Integrations currentUser={currentUser} />
      <SignOutOptions />
    </div>
  );
}
