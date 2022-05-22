import SectionTitle from "./SectionTitle";
import Button from "./Button";
import { logOut } from "../store/authSlice";

import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function SignOutOptions() {
  const dispatch = useDispatch();
  const router = useHistory();

  const handleLogout = () => {
    dispatch(logOut());
    router.push("/login");
  };

  return (
    <>
      <SectionTitle title="Log Out" underline />
      <div className="mb-1">Switch to or create another team</div>
      <Link to="/login/teams">
        <Button
          variant="outlined"
          color="black"
          className="w-full sm:w-auto"
          disabled={true}
        >
          Switch teams
        </Button>
      </Link>
      <div className="mt-4 mb-1">Log out of your account completely</div>
      <span>
        <Button
          onClick={handleLogout}
          color="red"
          className="w-full sm:w-auto"
          disabled={true}
        >
          Log out
        </Button>
      </span>
    </>
  );
}
