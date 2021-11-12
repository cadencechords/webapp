import CapoOption from "./CapoOption";

export default function CapoOptions({ onCapoChange, selectedCapo }) {
	return (
		<div className="flex items-center">
			<CapoOption
				capoKey="None"
				capoNumber="0"
				className="mr-4"
				onClick={onCapoChange}
				selected={selectedCapo === "None"}
			/>
			<CapoOption
				capoKey="G"
				capoNumber="2"
				className="mr-4"
				onClick={onCapoChange}
				selected={selectedCapo === "G"}
			/>
			<CapoOption
				capoKey="D"
				capoNumber="6"
				className="mr-4"
				onClick={onCapoChange}
				selected={selectedCapo === "D"}
			/>
			<CapoOption
				capoKey="C"
				capoNumber="4"
				className="mr-4"
				onClick={onCapoChange}
				selected={selectedCapo === "C"}
			/>
		</div>
	);
}
