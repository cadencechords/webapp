import { useEffect, useState } from "react";

import Dashboard from "../components/Dashboard";
import PageLoading from "../components/PageLoading";
import PageTitle from "../components/PageTitle";
import dashboardApi from "../api/dashboardApi";
import { reportError } from "../utils/error";
import { selectCurrentMember } from "../store/authSlice";
import { useSelector } from "react-redux";

export default function DashboardPage() {
	const currentMember = useSelector(selectCurrentMember);
	const [data, setData] = useState();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		document.title = "Cadence";

		async function fetchData() {
			try {
				setLoading(true);
				let { data } = await dashboardApi.getDashboardData();
				setData(data);
			} catch (error) {
				reportError(error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	if (!currentMember) return <PageLoading />;

	return (
		<>
			<PageTitle title={`Hi ${currentMember.first_name || currentMember.email}!`} />
			{loading ? <PageLoading /> : <Dashboard data={data} />}
		</>
	);
}
