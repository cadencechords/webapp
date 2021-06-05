import PlanningCenterLogo from "../../images/planning-center-white.svg";

const PCO_CLIENT_ID = process.env.REACT_APP_PCO_CLIENT_ID;
const PCO_REDIRECT_URI = process.env.REACT_APP_PCO_REDIRECT_URI;
export default function PlanningCenterButton() {
	const handleRedirectToPlanningCenter = () => {
		window.location =
			`https://api.planningcenteronline.com/oauth/authorize?client_id=${PCO_CLIENT_ID}` +
			`&redirect_uri=${PCO_REDIRECT_URI}&response_type=code&scope=services`;
	};

	return (
		<button
			className="focus:outline-none outline-none flex items-center justify-center rounded-md shadow-md p-2 bg-blue-600"
			style={{ height: "40px" }}
			onClick={handleRedirectToPlanningCenter}
		>
			<img src={PlanningCenterLogo} style={{ height: "100%" }} alt="Planning Center" />
		</button>
	);
}
