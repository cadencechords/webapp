import { useEffect } from "react";
import useQuery from "../hooks/useQuery";
import PlanningCenterApi from "../api/PlanningCenterApi";

export default function PlanningCenterRedirect() {
	const code = useQuery().get("code");

	useEffect(() => {
		if (code) {
			PlanningCenterApi.authorize(code);
		}
	}, [code]);

	return <>{code}</>;
}
