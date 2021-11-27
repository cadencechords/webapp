import Button from "./Button";
import RoadmapDragDropContext from "./RoadmapDragDopContext";
import SectionTitle from "./SectionTitle";
import { useState } from "react";

export default function Roadmap({ song }) {
	const [sections, setSections] = useState(["Chorus", "Verse 1", "Verse 2", "Chorus", "Chorus"]);

	function handleAddSection() {
		setSections((currentSections) => ["New", ...currentSections]);
	}

	return (
		<div className="mb-4">
			<SectionTitle title="Roadmap" />

			<div className="flex">
				<Button variant="outlined" size="xs" className="mr-4" onClick={handleAddSection}>
					Add
				</Button>
				<RoadmapDragDropContext sections={sections} onChange={setSections} />
			</div>
		</div>
	);
}
