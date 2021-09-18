import { Link } from "react-router-dom";
import OnsongLogo from "../images/onsong.svg";
import PlanningCenterButton from "../components/buttons/PlanningCenterButton";

export default function SongImportSourcesIndexPage() {
	return (
		<>
			<div className="font-bold text-2xl text-center py-4">Import Songs</div>

			<div className="grid grid-cols-1 w-5/6  md:w-2/3 xl:w-1/2 mx-auto gap-y-4">
				<Link to="/import/onsong">
					<button
						style={{ backgroundColor: "#1a1a1c", height: "40px" }}
						className="w-full focus:outline-none outline-none flex-center rounded-md shadow-md"
					>
						<img src={OnsongLogo} style={{ height: "22px" }} alt="Onsong" />
					</button>
				</Link>
				<PlanningCenterButton />
			</div>
		</>
	);
}
