import NoDataMessage from "./NoDataMessage";
import Subscription from "./Subscription";

export default function SubscriptionsList({ subscriptions }) {
	if (subscriptions.length === 0)
		return <NoDataMessage>You are not the billing manager for any teams</NoDataMessage>;

	return (
		<div className="grid grid-cols-1 gap-4">
			{subscriptions.map((subscription) => (
				<Subscription key={subscription.id} subscription={subscription} />
			))}
		</div>
	);
}
