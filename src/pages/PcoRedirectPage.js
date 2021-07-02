import { useEffect } from "react";
import useQuery from "../hooks/useQuery";
import PlanningCenterApi from "../api/PlanningCenterApi";
import { useHistory } from "react-router";

export default function PcoRedirectPage() {
	const code = useQuery().get("code");
	const router = useHistory();

	useEffect(() => {
		async function authorize() {
			try {
				await PlanningCenterApi.authorize(code);
				router.push("/import/pco/songs");
			} catch (error) {
				console.log(error);
			}
		}
		if (code) {
			authorize();
		}
	}, [code, router]);

	return <>Connecting to your account...</>;
}
