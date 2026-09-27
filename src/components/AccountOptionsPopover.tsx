import { logOut, selectCurrentUser } from '../store/authSlice';

import Icon from './Icon';
import { MenuDivider, MenuItem, MenuList } from './Menu';
import ProfilePicture from './ProfilePicture';
import StyledPopover from './StyledPopover';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';

export default function AccountOptionsPopover() {
  const dispatch = useDispatch();
  const router = useHistory();
  const currentUser = useSelector(selectCurrentUser);

  const button = <ProfilePicture url={currentUser?.image_url} size="xs" />;

  const handleLogOut = () => {
    dispatch(logOut());
    router.push('/login');
  };

  return (
    <div className="mr-5">
      <StyledPopover button={button} position="bottom-start">
        <MenuList className="w-60">
          <MenuItem to="/account" icon={<Icon name="account_circle" />}>
            Account
          </MenuItem>
          <MenuDivider />
          <MenuItem
            destructive
            onClick={handleLogOut}
            icon={<Icon name="logout" />}
          >
            Log out
          </MenuItem>
        </MenuList>
      </StyledPopover>
    </div>
  );
}
