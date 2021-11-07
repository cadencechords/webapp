import Button from "./Button";
import CenteredPage from "./CenteredPage";
import PageTitle from "./PageTitle";

export default function AppFallback() {
	return (
		<CenteredPage>
			<PageTitle title="Well, this is embarrassing." align="center" />
			<div>Looks like something went wrong. We've been notified of the issue.</div>
			<Button full className="mt-4" onClick={() => window.location.reload()}>
				Refresh Page
			</Button>
		</CenteredPage>
	);
}
