import Badge from "./Badge";
import Button from "./Button";
import billingApi from "../api/billingApi";
import { reportError } from "../utils/error";
import { useState } from "react";

export default function Subscription({ subscription }) {
	const [loading, setLoading] = useState(false);

	async function handleCreateCustomerPortalSession() {
		try {
			setLoading(true);
			let { data } = await billingApi.createCustomerPortalSession(window.location.href);
			window.location = data.url;
		} catch (error) {
			reportError(error);
			setLoading(false);
		}
	}

	return (
		<div className="rounded-md border dark:border-dark-gray-600 p-2 flex-between">
			<div>
				<h4 className="font-semibold mb-2">
					{subscription.team.name}
					{subscription.status === "trialing" && (
						<Badge color="green" className="ml-2">
							Trialing
						</Badge>
					)}
				</h4>
				<h5 className="text-sm">
					Subscribed to <span className="font-semibold">{subscription.plan_name} Plan</span>
				</h5>
			</div>
			<Button
				variant="outlined"
				onClick={handleCreateCustomerPortalSession}
				loading={loading}
				size="xs"
			>
				Manage billing
			</Button>
		</div>
	);
}
