import { useState } from "react";

import ArrowNarrowLeftIcon from "@heroicons/react/outline/ArrowNarrowLeftIcon";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import SubscriptionsList from "../components/SubscriptionsList";

export default function AccountBillingPage() {
  const [subscriptions] = useState([
    {
      plan_name: "Starter",
      status: "active",
      stripe_price_id: null,
      stripe_product_id: null,
      stripe_subscription_id: null,
      team_id: 1,
      user_id: 1,
      created_at: "2022-02-13T03:02:23.470Z",
      updated_at: "2022-02-13T03:02:23.470Z",
      team: {
        name: "Testing Team",
      },
    },
  ]);

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
        Below are the teams you are the billing manager for. Clicking on "Manage
        billing" will take you to a portal where you'll be able upgrade or
        downgrade your team's subscription.
      </p>
      <SubscriptionsList subscriptions={subscriptions} />
    </div>
  );
}
