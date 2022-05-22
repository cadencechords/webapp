import Badge from "./Badge";
import Button from "./Button";

export default function Subscription({ subscription }) {
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
          Subscribed to{" "}
          <span className="font-semibold">{subscription.plan_name} Plan</span>
        </h5>
      </div>
      <Button variant="outlined" size="xs" disabled={true}>
        Manage billing
      </Button>
    </div>
  );
}
