import DashboardRecentlyViewed from './DashboardRecentlyViewed';
import DashboardTodaysSetlists from './DashboardTodaysSetlists';
import type { DashboardData } from '../api/dashboardApi';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';

export default function Dashboard({ data }: { data?: DashboardData }) {
  // From this browser, so shown even when the dashboard data didn't load.
  const recentlyViewed = useRecentlyViewed();

  if (!data && recentlyViewed.length === 0) return null;

  return (
    <div className="grid grid-cols-3 items-start gap-x-8">
      {data && (
        <div className="col-span-3 lg:col-span-2 xl:col-span-1">
          <DashboardTodaysSetlists setlists={data.todays_setlists} />
        </div>
      )}
      {recentlyViewed.length > 0 && (
        <div className="col-span-3 lg:col-span-2 xl:col-span-1">
          <DashboardRecentlyViewed items={recentlyViewed} />
        </div>
      )}
    </div>
  );
}
