// import CadenceButton from "./buttons/CadenceButton";
import PlanningCenterButton from "./buttons/PlanningCenterButton";

export default function SongImportSources() {
	return (
		<>
			<div className="font-bold text-2xl text-center py-4">Import Songs</div>

			<div className="grid grid-cols-1 w-5/6  md:w-2/3 xl:w-1/2 mx-auto gap-y-4">
				{/* <button className="bg-blue-600">OnSong</button> */}
				<PlanningCenterButton />
				{/* <CadenceButton /> */}
			</div>
		</>
	);
}
