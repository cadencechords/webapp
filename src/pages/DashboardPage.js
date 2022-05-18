import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentMember } from "../store/authSlice";

import Dashboard from "../components/Dashboard";

import PageTitle from "../components/PageTitle";

export default function DashboardPage() {
  const currentMember = useSelector(selectCurrentMember);
  const [data, setData] = useState();

  return (
    <>
      <PageTitle
        title={`Hi ${currentMember.first_name || currentMember.email}!`}
      />
      {/* <Dashboard data={data} /> */}
    </>
  );
}
