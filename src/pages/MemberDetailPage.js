import { useEffect, useState } from "react";

import Alert from "../components/Alert";
import Button from "../components/Button";
import MemberMenu from "../components/mobile menus/MemberMenu";
import ProfilePicture from "../components/ProfilePicture";
import { toMonthYearDate } from "../utils/DateUtils";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import MembershipsApi from "../api/membershipsApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../store/authSlice";

export default function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState();
  const [memberMenuOpen, setMemberMenuOpen] = useState(false);
  const [alert, setAlert] = useState();
  const router = useHistory();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    let { data } = MembershipsApi.getOne(id);
    console.log(data);
    setMember(data);
  }, [id]);

  const hasName = () => {
    return member?.first_name && member?.last_name;
  };

  const getFullName = () => {
    return `${member.first_name} ${member.last_name}`;
  };

  const handleMemberRemoved = () => {
    setMemberMenuOpen(false);
    setAlert(
      "You have just removed this member. You will be redirected to the members page shortly."
    );
    setTimeout(() => {
      router.push("/members");
    }, 4000);
  };

  if (!member) {
    return null;
  }

  return (
    <>
      <div className="mx-auto max-w-sm mt-4">
        {alert && (
          <div className="mb-4">
            <Alert color="yellow">{alert}</Alert>
          </div>
        )}
        <div className="text-2xl font-bold mb-1 text-center">
          {hasName() ? getFullName() : member?.email}
        </div>
        <div className="text-gray-600 dark:text-dark-gray-200 text-lg mb-4 text-center">
          {hasName() ? member?.email : "No name provided yet"}
        </div>
        <div className="mb-2 flex-center">
          <ProfilePicture url={member?.image_url} />
        </div>

        <div className="text-sm mb-4">
          <div className="text-gray-600 dark:text-dark-gray-200 flex-between border-b dark:border-dark-gray-600 pb-2">
            <div className="font-semibold">Position:</div>
            {member?.position || "No position provided yet"}
          </div>
          <div className="text-gray-600 dark:text-dark-gray-200 flex-between py-2">
            <div className="font-semibold">Joined:</div>
            {toMonthYearDate(member?.created_at)}
          </div>
        </div>
        <Button full variant="outlined" onClick={() => setMemberMenuOpen(true)}>
          Actions
        </Button>
        <MemberMenu
          open={memberMenuOpen}
          onCloseDialog={() => setMemberMenuOpen(false)}
          member={member}
          onRemoved={handleMemberRemoved}
          isCurrentUser={currentUser.id === member.id}
        />
      </div>
    </>
  );
}
