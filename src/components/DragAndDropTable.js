import TrashIcon from "@heroicons/react/outline/TrashIcon";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Button from "./Button";

export default function DragAndDropTable({ onReorder, items, removeable, onRemove, onClick }) {
	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	const onDragEnd = (result) => {
		if (!result.destination) {
			return;
		}

		const reorderedItems = reorder(items, result.source.index, result.destination.index);
		const movedItem = { id: result.draggableId, newPosition: result.destination.index };
		if (onReorder) onReorder(reorderedItems, movedItem);
	};

	const getItemStyle = (isDragging, draggableStyle) => ({
		// some basic styles to make the items look a bit nicer
		userSelect: "none",

		// change background colour if dragging
		background: isDragging ? "#fafafa" : "white",

		// styles we need to apply on draggables
		...draggableStyle,
	});

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppable">
				{(provided, snapshot) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{items.map((item, index) => {
							return (
								<Draggable key={item.id} draggableId={`${item.id}`} index={index}>
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
											className="border-b hover:bg-gray-50 py-2 px-2 bg-white flex items-center justify-between"
											style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
										>
											<span
												onClick={() => onClick(item.id)}
												className="cursor-pointer hover:text-blue-600"
											>
												{item.name}
											</span>

											{removeable && (
												<Button
													color="grey"
													size="xs"
													variant="open"
													onClick={() => onRemove(item.id)}
												>
													<TrashIcon className="h-4 w-4 text-gray-600" />
												</Button>
											)}
										</div>
									)}
								</Draggable>
							);
						})}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}

DragAndDropTable.defaultProps = {
	items: [],
	removeable: false,
};
