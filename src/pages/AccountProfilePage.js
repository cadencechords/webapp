import AccountProfileBasicInfo from "../components/AccountProfileBasicInfo";
import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import ProfilePictureDetail from "../components/ProfilePictureDetail";
import { useState } from "react";
import MembershipsApi from "../api/membershipsApi";

export default function AccountProfilePage() {
  const [currentUser, setCurrentUser] = useState(
    () => MembershipsApi.getMyMember().data
  );

  function handleUpdated(updates) {
    setCurrentUser((u) => ({ ...u, ...updates }));
  }

  return (
    <div>
      <Link to="/account">
        <Button variant="open" color="gray">
          <div className="flex-center">
            <ArrowNarrowLeftIcon className="mr-4 w-4 h-4" />
            Menu
          </div>
        </Button>
      </Link>
      <PageTitle title="Profile" className="mb-4" />
      <div className="mb-4">
        <ProfilePictureDetail url={currentUser.image_url} />
      </div>
      <AccountProfileBasicInfo user={currentUser} onUpdated={handleUpdated} />
    </div>
  );
}
