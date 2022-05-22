import { Link } from "react-router-dom";
import MobileMenuButton from "./buttons/MobileMenuButton";
import ProfilePicture from "./ProfilePicture";
import StyledPopover from "./StyledPopover";
import { selectCurrentUserProfilePicture } from "../store/authSlice";
import { useSelector } from "react-redux";

export default function AccountOptionsPopover() {
  const profilePicture = useSelector(selectCurrentUserProfilePicture);
  let button = <ProfilePicture url={profilePicture} size="xs" />;

  return (
    <div className="mr-5">
      <StyledPopover button={button} position="bottom-start">
        <div className="w-60">
          <Link to="/account">
            <MobileMenuButton
              color="black"
              full
              size="sm"
              className="rounded-t-md"
            >
              Account
            </MobileMenuButton>
          </Link>
          <hr className="dark:border-dark-gray-400" />
          <MobileMenuButton
            full
            color="red"
            className="rounded-b-md"
            size="sm"
            disabled={true}
          >
            Log out
          </MobileMenuButton>
        </div>
      </StyledPopover>
    </div>
  );
}
