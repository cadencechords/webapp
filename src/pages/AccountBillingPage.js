import { useEffect, useState } from "react";

import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import PageLoading from "../components/PageLoading";
import PageTitle from "../components/PageTitle";
import SubscriptionsList from "../components/SubscriptionsList";
import { reportError } from "../utils/error";
import subscriptionsApi from "../api/subscriptionsApi";

export default function AccountBillingPage() {
	const [subscriptions, setSubscriptions] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		document.title = "Billing";

		async function fetchData() {
			try {
				setLoading(true);
				let { data } = await subscriptionsApi.getAll();
				setSubscriptions(data);
			} catch (error) {
				reportError(error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	if (loading) return <PageLoading />;

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
			<PageTitle title="Billing" />
			<p className="leading-relaxed mb-4">
				Below are the teams you are the billing manager for. Clicking on "Manage billing" will take
				you to a portal where you'll be able upgrade or downgrade your team's subscription.
			</p>
			<SubscriptionsList subscriptions={subscriptions} />
		</div>
	);
}
