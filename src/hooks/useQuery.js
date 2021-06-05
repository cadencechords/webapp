import { useLocation } from "react-router-dom";

export default function useQuery() {
	console.log("getting it");
	return new URLSearchParams(useLocation().search);
}
