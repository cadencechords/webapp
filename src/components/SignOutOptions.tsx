import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logOut } from '../store/authSlice';
import Icon from './Icon';
import SectionTitle from './SectionTitle';
import { SettingsRowText } from './settings/SettingsRow';
import { LIST_ITEM_INTERACTIVE, LIST_ITEM_TWO_LINE } from './lists/listItem';

// Switching teams and logging out, as a segmented list of clickable rows:
// logging out in the error color.
export default function SignOutOptions() {
  const dispatch = useDispatch();
  const router = useHistory();

  const handleLogout = () => {
    dispatch(logOut());
    router.push('/login');
  };

  return (
    <section className="mb-8">
      <SectionTitle title="Account" />
      <div className="list-segmented">
        <Link
          to="/login/teams"
          className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE}`}
        >
          <SettingsRowText
            icon="swap_horiz"
            title="Switch teams"
            description="Switch to or create another team"
          />
          <Icon
            name="chevron_right"
            className="w-6 h-6 shrink-0 text-on-surface-variant"
          />
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE} w-full text-left`}
        >
          <SettingsRowText
            icon="logout"
            title="Log out"
            description="Log out of your account completely"
            destructive
          />
        </button>
      </div>
    </section>
  );
}
