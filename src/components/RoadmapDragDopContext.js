import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import RoadmapSection from "./RoadmapSection";

export default function RoadmapDragDropContext({ sections, onChange }) {
	function handleDragEnd({ source, destination }) {
		if (!destination) return;

		let reordered = reorder(sections, source.index, destination.index);
		onChange(reordered);
	}

	function reorder(list, startIndex, endIndex) {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	}

	function handleChangeSection(updatedSectionName, indexToUpdate) {
		onChange(
			sections.map((section, index) => (index === indexToUpdate ? updatedSectionName : section))
		);
	}

	function handleDeleteSection(indexToDelete) {
		onChange(sections.filter((section, index) => index !== indexToDelete));
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId="droppable" direction="horizontal">
				{(provided, snapshot) => (
					<div ref={provided.innerRef} {...provided.droppableProps}>
						{sections.map((section, index) => (
							<Draggable key={index} draggableId={`${index}`} index={index}>
								{(provided) => (
									<span
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										ref={provided.innerRef}
										className="mr-2"
									>
										<RoadmapSection
											section={section}
											onChange={(newValue) => handleChangeSection(newValue, index)}
											onDelete={() => handleDeleteSection(index)}
										/>
									</span>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}
