import { useSelector } from "react-redux";
import { selectCurrentMember } from "../store/authSlice";

import PageTitle from "../components/PageTitle";

export default function DashboardPage() {
  const currentMember = useSelector(selectCurrentMember);

  return (
    <>
      <PageTitle
        title={`Hi ${currentMember.first_name || currentMember.email}!`}
      />
      {/* <Dashboard data={data} /> */}
    </>
  );
}
