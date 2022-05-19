import MobileMenuButton from "../buttons/MobileMenuButton";
import { REMOVE_MEMBERS } from "../../utils/constants";
import StyledDialog from "../StyledDialog";
import UserRemoveIcon from "@heroicons/react/outline/UserRemoveIcon";
import { removeFromTeam, selectCurrentMember } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function MemberMenu({
  onCloseDialog,
  open,
  member,
  onRemoved,
  isCurrentUser,
}) {
  const currentMember = useSelector(selectCurrentMember);
  const dispatch = useDispatch();

  const handleRemoveFromTeam = () => {
    dispatch(removeFromTeam(member.id));
    onCloseDialog();
  };

  let removeFromTeamButton = currentMember.can(REMOVE_MEMBERS) && (
    <MobileMenuButton
      full
      color="red"
      onClick={handleRemoveFromTeam}
      disabled={isCurrentUser}
    >
      <div className="flex items-center">
        <UserRemoveIcon className="mr-4 h-5" />
        Remove from team
      </div>
    </MobileMenuButton>
  );

  const hasName = () => {
    return member.first_name && member.last_name;
  };

  if (member) {
    return (
      <StyledDialog
        onCloseDialog={onCloseDialog}
        open={open}
        title={
          hasName() ? member.first_name + " " + member.last_name : member.email
        }
        fullscreen={false}
      >
        {removeFromTeamButton}
      </StyledDialog>
    );
  } else {
    return null;
  }
}
