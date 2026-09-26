import AccountProfileBasicInfo from '../components/AccountProfileBasicInfo';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import ProfilePictureDetail from '../components/ProfilePictureDetail';
import { selectCurrentUser } from '../store/authSlice';
import { useSelector } from 'react-redux';
import Icon from '../components/Icon';

export default function AccountProfilePage() {
  const currentUser = useSelector(selectCurrentUser);

  if (!currentUser) return <>Loading...</>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/account">
        <Button variant="open" color="gray">
          <div className="flex-center">
            <Icon name="arrow_back" className="w-4 h-4 mr-4" />
            Menu
          </div>
        </Button>
      </Link>
      <PageTitle title="Profile" className="mb-4" />
      <div className="mb-4">
        <ProfilePictureDetail url={currentUser.image_url} />
      </div>
      <AccountProfileBasicInfo user={currentUser} />
    </div>
  );
}
