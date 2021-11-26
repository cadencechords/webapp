import DashboardTodaysSetlists from "./DashboardTodaysSetlists";

export default function Dashboard({ data }) {
	if (!data) return null;

	return (
		<div className="grid grid-cols-3">
			<div className="col-span-3 lg:col-span-2 xl:col-span-1 border-b dark:border-dark-gray-600 ">
				<DashboardTodaysSetlists setlists={data.todays_setlists} />
			</div>
		</div>
	);
}
