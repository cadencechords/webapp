import CenteredPage from "../components/CenteredPage";
import PageLoading from "../components/PageLoading";
import billingApi from "../api/billingApi";
import { useEffect } from "react";

export default function CustomerPortalSessionGeneratorPage() {
	useEffect(() => {
		async function fetchSession() {
			try {
				let { data } = await billingApi.createCustomerPortalSession();
				window.location = data.url;
			} catch (error) {
				console.log(error);
			}
		}

		fetchSession();
	}, []);
	return (
		<CenteredPage>
			<PageLoading />;
		</CenteredPage>
	);
}
