import React, { useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import {
  useDeleteMarking,
  useUpdateMarking,
} from '../hooks/api/markings.hooks';
import classNames from 'classnames';
import ShapeMarking from './ShapeMarking';
import MarkingOptionsPopover from './MarkingOptionsPopover';
import Draggable from 'react-draggable';

export default function Marking({ marking, song, onDeleted }) {
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const markingRef = useRef();
  const [initialCoordinates] = useState({
    x: parseFloat(marking.x),
    y: parseFloat(marking.y),
  });

  const [scale, setScale] = useState(parseFloat(marking.scale));
  const [rotation, setRotation] = useState(parseFloat(marking.rotation));
  const { run: updateMarking } = useUpdateMarking();
  const { run: deleteMarking } = useDeleteMarking({
    onSuccess: () => onDeleted(marking.id),
  });

  function handleSaveUpdates(updates) {
    updateMarking({
      markingId: marking.id,
      songId: song.id,
      updates,
    });
  }

  function handleClick(e) {
    if (e.type === 'contextmenu') {
      e.preventDefault();
      setIsContextMenuVisible(true);
    }
  }

  useGesture(
    {
      onPinch: ({ offset: [s, newRotation], memo }) => {
        const newScale = 1 + s / 40;
        if (newScale >= 0.2 && newScale <= 6) {
          setScale(newScale);
        }
        setRotation(newRotation);
        return memo;
      },
      onPinchEnd: ({ offset: [s, newRotation] }) => {
        const newScale = 1 + s / 40;
        const updates = { rotation: newRotation };
        if (newScale >= 0.2 && newScale <= 6) {
          updates.scale = newScale;
        }

        handleSaveUpdates(updates);
      },
    },
    {
      domTarget: markingRef,
      eventOptions: {
        passive: false,
      },
    }
  );

  return (
    <Draggable
      defaultPosition={initialCoordinates}
      onStop={(_e, data) => handleSaveUpdates({ x: data.x, y: data.y })}
    >
      <span className="absolute z-20">
        {marking.marking_type === 'shapes' ? (
          <div
            onClick={handleClick}
            onContextMenu={handleClick}
            style={{
              paddingLeft: '40px',
              paddingRight: '40px',
              paddingTop: '15px',
              paddingBottom: '15px',
            }}
          >
            <ShapeMarking
              marking={marking}
              ref={markingRef}
              style={{
                transform: `rotate(${rotation}deg) scale(${scale})`,
                touchAction: 'none',
              }}
            />
          </div>
        ) : (
          <div
            onClick={handleClick}
            ref={markingRef}
            onContextMenu={handleClick}
            className={classNames(
              'whitespace-nowrap text-center leading-none',
              marking.marking_type === 'dynamics' && 'font-bold italic'
            )}
            style={{
              touchAction: 'none',
              paddingLeft: '40px',
              paddingRight: '40px',
              paddingTop: '15px',
              paddingBottom: '15px',
              fontSize: '60px',
              fontFamily:
                marking.marking_type === 'dynamics' && 'Times New Roman',
              transform: `rotate(${rotation}deg) scale(${scale})`,
            }}
          >
            {marking.content}
          </div>
        )}
        <MarkingOptionsPopover
          onDelete={() =>
            deleteMarking({ markingId: marking.id, songId: song.id })
          }
          onClose={() => setIsContextMenuVisible(false)}
          isOpen={isContextMenuVisible}
        />
      </span>
    </Draggable>
  );
}
