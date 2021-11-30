import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

import RoadmapSection from "./RoadmapSection";
import { useState } from "react";

export default function RoadmapDragDropContext({ sections, onChange, onDragStart, onDragEnd }) {
	const [scrollTimeoutId, setScrollTimeoutId] = useState();

	function handleDragEnd({ source, destination }) {
		onDragEnd?.();
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

	function getItemStyle(isDragging, draggableStyle) {
		return {
			...draggableStyle,
		};
	}

	function handleScroll() {
		if (onDragStart && onDragEnd) {
			onDragStart();
			clearTimeout(scrollTimeoutId);
			setScrollTimeoutId(setTimeout(onDragEnd), 150);
		}
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd} onDragStart={onDragStart}>
			<Droppable
				droppableId="droppable"
				direction="horizontal"
				renderClone={(provided, snapshot, item) => (
					<div
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						ref={provided.ref}
						style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
					>
						<RoadmapSection section={sections[item.source.index]} />
					</div>
				)}
			>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						onScroll={handleScroll}
						className="flex items-center overflow-x-auto overflow-y-hidden py-2"
					>
						{sections.map((section, index) => (
							<Draggable key={index} draggableId={`${index}`} index={index}>
								{(provided, snapshot) => (
									<div
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										ref={provided.innerRef}
										className="mr-2"
										style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
									>
										<RoadmapSection
											section={section}
											onChange={(newValue) => handleChangeSection(newValue, index)}
											onDelete={() => handleDeleteSection(index)}
										/>
									</div>
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
