import MobileMenuButton from '../buttons/MobileMenuButton';
import { REMOVE_MEMBERS } from '../../utils/constants';
import StyledDialog from '../StyledDialog';
import UserApi from '../../api/UserApi';
import UserRemoveIcon from '@heroicons/react/outline/UserRemoveIcon';
import { reportError } from '../../utils/error';
import { selectCurrentMember } from '../../store/authSlice';
import { useSelector } from 'react-redux';

export default function MemberMenu({ onCloseDialog, open, member, onRemoved }) {
  const currentMember = useSelector(selectCurrentMember);

  const handleRemoveFromTeam = async () => {
    try {
      await UserApi.deleteMembership(member.id);
      onRemoved(member.id);
    } catch (error) {
      reportError(error);
    }
  };

  let removeFromTeamButton = currentMember.can(REMOVE_MEMBERS) && (
    <MobileMenuButton full color="red" onClick={handleRemoveFromTeam}>
      <div className="flex items-center">
        <UserRemoveIcon className="mr-4 h-5" />
        Remove from team
      </div>
    </MobileMenuButton>
  );

  const hasName = () => {
    return member?.first_name && member?.last_name;
  };

  return (
    <StyledDialog
      onCloseDialog={onCloseDialog}
      open={open}
      title={
        hasName() ? member.first_name + ' ' + member.last_name : member?.email
      }
      fullscreen={false}
    >
      {member && removeFromTeamButton}
    </StyledDialog>
  );
}
