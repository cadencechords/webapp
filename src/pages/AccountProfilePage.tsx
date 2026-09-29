import { useSelector } from 'react-redux';
import AccountProfileBasicInfo from '../components/AccountProfileBasicInfo';
import ProfilePictureDetail from '../components/ProfilePictureDetail';
import AccountPageHeader from '../components/settings/AccountPageHeader';
import { selectCurrentUser } from '../store/authSlice';

// The profile, in M3E: the photo on a card, then the personal info form.
export default function AccountProfilePage() {
  const currentUser = useSelector(selectCurrentUser);

  if (!currentUser) return <>Loading...</>;

  return (
    <div className="max-w-2xl mx-auto font-plain">
      <AccountPageHeader title="Profile" />
      <div className="flex flex-col gap-4">
        <ProfilePictureDetail url={currentUser.image_url} />
        <AccountProfileBasicInfo user={currentUser} />
      </div>
    </div>
  );
}
