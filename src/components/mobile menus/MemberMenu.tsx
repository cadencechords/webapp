import { MenuItem, MenuList } from '../Menu';
import { REMOVE_MEMBERS } from '../../utils/constants';
import StyledDialog from '../StyledDialog';
import UserApi from '../../api/UserApi';
import { reportError } from '../../utils/error';
import { selectCurrentMember } from '../../store/authSlice';
import { useSelector } from 'react-redux';
import Icon from '../Icon';
import type { User } from '../../types';

type MemberMenuProps = {
  onCloseDialog: () => void;
  open: boolean;
  /** Nothing to act on until it's set: the dialog is empty. */
  member: User | null | undefined;
  /** Called with the member's id once they're off the team. */
  onRemoved: (memberId: number) => void;
};

export default function MemberMenu({
  onCloseDialog,
  open,
  member,
  onRemoved,
}: MemberMenuProps) {
  // Non-null: the members pages render inside Content, which renders nothing
  // until the membership loads.
  const currentMember = useSelector(selectCurrentMember)!;

  const handleRemoveFromTeam = async () => {
    try {
      // Non-null: the button that calls this renders only with a member.
      await UserApi.deleteMembership(member!.id);
      onRemoved(member!.id);
    } catch (error) {
      reportError(error);
    }
  };

  const removeFromTeamButton = currentMember.can(REMOVE_MEMBERS) && (
    <MenuItem
      destructive
      onClick={handleRemoveFromTeam}
      icon={<Icon name="person_remove" />}
    >
      Remove from team
    </MenuItem>
  );

  const hasName = () => {
    return member?.first_name && member?.last_name;
  };

  // Non-null (in the title): hasName() is true only with a member.
  return (
    <StyledDialog
      onCloseDialog={onCloseDialog}
      open={open}
      title={
        hasName() ? member!.first_name + ' ' + member!.last_name : member?.email
      }
      fullscreen={false}
    >
      {member && removeFromTeamButton && (
        <MenuList className="-mx-3 *:rounded-medium">
          {removeFromTeamButton}
        </MenuList>
      )}
    </StyledDialog>
  );
}
