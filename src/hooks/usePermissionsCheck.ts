import { useSelector } from 'react-redux';
import { selectCurrentMember } from '../store/authSlice';

export default function usePermissionsCheck() {
  const currentMember = useSelector(selectCurrentMember);

  function can(permission) {
    return currentMember.can(permission);
  }

  return { can };
}
