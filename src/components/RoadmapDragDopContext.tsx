import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import type {
  DraggingStyle,
  DropResult,
  NotDraggingStyle,
} from 'react-beautiful-dnd';

import RoadmapSection from './RoadmapSection';
import Icon from './Icon';
import { useState } from 'react';

type RoadmapDragDropContextProps = {
  /** Section names in play order. */
  sections: string[];
  onChange: (sections: string[]) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

export default function RoadmapDragDropContext({
  sections,
  onChange,
  onDragStart,
  onDragEnd,
}: RoadmapDragDropContextProps) {
  const [scrollTimeoutId, setScrollTimeoutId] = useState<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  function handleDragEnd({ source, destination }: DropResult) {
    onDragEnd?.();
    if (!destination) return;

    const reordered = reorder(sections, source.index, destination.index);
    onChange(reordered);
  }

  function reorder(list: string[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  function handleChangeSection(
    updatedSectionName: string,
    indexToUpdate: number
  ) {
    onChange(
      sections.map((section, index) =>
        index === indexToUpdate ? updatedSectionName : section
      )
    );
  }

  function handleDeleteSection(indexToDelete: number) {
    onChange(sections.filter((section, index) => index !== indexToDelete));
  }

  function getItemStyle(
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined
  ) {
    return {
      ...draggableStyle,
    };
  }

  function handleScroll() {
    if (onDragStart && onDragEnd) {
      onDragStart();
      clearTimeout(scrollTimeoutId);
      // No delay, as before: the 150 used to be passed to the state setter,
      // which ignores a second argument, not to `setTimeout`.
      setScrollTimeoutId(setTimeout(onDragEnd));
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
            // No ref, as before: this passed provided.ref, which
            // DraggableProvided doesn't have (it's always undefined).
            // react-beautiful-dnd documents provided.innerRef for clones.
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
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
            // Scrolls sideways, fading out at its edges; the padding keeps
            // the first and last sections clear of the fade.
            className="flex items-center overflow-x-auto overflow-y-hidden py-2 px-3 [scrollbar-width:none] [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-12px),transparent)]"
          >
            {sections.map((section, index) => (
              <Draggable key={index} draggableId={`${index}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="flex items-center"
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <RoadmapSection
                      section={section}
                      onChange={newValue =>
                        handleChangeSection(newValue, index)
                      }
                      onDelete={() => handleDeleteSection(index)}
                    />
                    {/* Then: a chevron to the next section. */}
                    {index < sections.length - 1 && (
                      <Icon
                        name="chevron_right"
                        className="w-4 h-4 mx-0.5 shrink-0 text-on-surface-variant"
                      />
                    )}
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
