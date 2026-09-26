import { useSelector } from 'react-redux';
import { selectCurrentMember } from '../store/authSlice';

export default function usePermissionsCheck() {
  const currentMember = useSelector(selectCurrentMember);

  /** Whether the current member's role has a permission, e.g. `EDIT_SONGS`. */
  function can(permission: string) {
    // Non-null: kept as before, this throws if called before the membership
    // loads.
    return currentMember!.can(permission);
  }

  return { can };
}
