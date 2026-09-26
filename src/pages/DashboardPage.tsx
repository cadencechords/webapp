import { useEffect, useState } from 'react';

import Dashboard from '../components/Dashboard';
import PageLoading from '../components/PageLoading';
import PageTitle from '../components/PageTitle';
import dashboardApi, { type DashboardData } from '../api/dashboardApi';
import { reportError } from '../utils/error';
import { selectCurrentMember } from '../store/authSlice';
import { useSelector } from 'react-redux';

export default function DashboardPage() {
  const currentMember = useSelector(selectCurrentMember);
  const [data, setData] = useState<DashboardData | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Mezzo';

    async function fetchData() {
      try {
        setLoading(true);
        const { data } = await dashboardApi.getDashboardData();
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
      <PageTitle
        title={`Hi ${currentMember.first_name || currentMember.email}!`}
      />
      {loading ? <PageLoading /> : <Dashboard data={data} />}
    </>
  );
}
