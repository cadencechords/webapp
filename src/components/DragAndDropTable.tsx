import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import Button from './Button';
import type { CSSProperties } from 'react';
import KeyBadge from './KeyBadge';
import { hasAnyKeysSet } from '../utils/SongUtils';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import classNames from 'classnames';
import { LIST_ITEM, LIST_ITEM_INTERACTIVE } from './lists/listItem';
import type { Song } from '../types';

type MovedItem = { id: string; newPosition: number };

type DragAndDropTableProps = {
  onReorder?: (items: Song[], movedItem: MovedItem) => void;
  items?: Song[];
  removeable?: boolean;
  onRemove?: (id: number) => void;
  /** Unused: each row links to its song. */
  onClick?: unknown;
  rearrangeable?: boolean;
};

type DragResult = {
  draggableId: string;
  source: { index: number };
  destination?: { index: number } | null;
};

export default function DragAndDropTable({
  onReorder,
  items = [],
  removeable = false,
  onRemove,
  rearrangeable = true,
}: DragAndDropTableProps) {
  const reorder = (list: Song[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: DragResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    const movedItem = {
      id: result.draggableId,
      newPosition: result.destination.index,
    };
    if (onReorder) onReorder(reorderedItems, movedItem);
  };

  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: CSSProperties | undefined
  ) => ({
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  // A segment of a grouped list; list-segmented lifts it while it's dragged
  // (data-dragging).
  const ROW = classNames(LIST_ITEM, LIST_ITEM_INTERACTIVE, 'justify-between');

  if (rearrangeable) {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="list-segmented"
            >
              {items.map((item, index) => {
                return (
                  <Draggable
                    key={item.id}
                    draggableId={`${item.id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={ROW}
                        data-dragging={snapshot.isDragging || undefined}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <span className="flex items-center min-w-0">
                          <Link
                            className="whitespace-pre-wrap cursor-pointer hover:underline"
                            to={`/songs/${item.id}`}
                          >
                            {item.name}
                          </Link>
                          {hasAnyKeysSet(item) && (
                            <KeyBadge
                              songKey={item.transposed_key || item.original_key}
                            />
                          )}
                        </span>

                        {removeable && (
                          <Button
                            color="gray"
                            size="md"
                            variant="icon"
                            onClick={() => onRemove?.(item.id)}
                          >
                            <Icon name="delete" className="w-4 h-4" />
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
  } else {
    return (
      <div className="list-segmented">
        {items.map(item => (
          <div className={ROW} key={item.id}>
            <span className="flex items-center min-w-0">
              <Link
                className="cursor-pointer hover:underline"
                to={`/songs/${item.id}`}
              >
                {item.name}
              </Link>
              {hasAnyKeysSet(item) && (
                <KeyBadge songKey={item.transposed_key || item.original_key} />
              )}
            </span>

            {removeable && (
              <Button
                color="gray"
                size="xs"
                variant="open"
                onClick={() => onRemove?.(item.id)}
              >
                <Icon name="delete" className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  }
}
