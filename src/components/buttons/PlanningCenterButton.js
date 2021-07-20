import PlanningCenterLogo from "../../images/planning-center-white.svg";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/authSlice";
import { useHistory } from "react-router";

const PCO_CLIENT_ID = process.env.REACT_APP_PCO_CLIENT_ID;
const PCO_REDIRECT_URI = process.env.REACT_APP_PCO_REDIRECT_URI;

export default function PlanningCenterButton() {
	const currentUser = useSelector(selectCurrentUser);
	const router = useHistory();

	const handleClick = () => {
		if (currentUser?.pco_connected) {
			router.push("/import/pco/songs");
		} else {
			window.location =
				`https://api.planningcenteronline.com/oauth/authorize?client_id=${PCO_CLIENT_ID}` +
				`&redirect_uri=${PCO_REDIRECT_URI}&response_type=code&scope=services`;
		}
	};

	return (
		<button
			className="focus:outline-none outline-none flex-center rounded-md shadow-md p-2 bg-blue-600"
			style={{ height: "40px" }}
			onClick={handleClick}
		>
			<img src={PlanningCenterLogo} style={{ height: "100%" }} alt="Planning Center" />
		</button>
	);
}
