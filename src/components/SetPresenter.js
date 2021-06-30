import { useSelector } from "react-redux";
import { selectSetlistBeingPresented } from "../store/presenterSlice";

export default function SetPresenter() {
	const setlist = useSelector(selectSetlistBeingPresented);
	return <>{setlist.name}</>;
}
