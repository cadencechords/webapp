import React, { useRef, useState } from 'react';
import { useGesture } from 'react-use-gesture';
import { useUpdateMarking } from '../hooks/api/markings.hooks';
import classNames from 'classnames';
import ShapeMarking from './ShapeMarking';
export default function Marking({ marking, song }) {
  const markingRef = useRef();
  const [initialCoordinates] = useState({
    x: parseFloat(marking.x),
    y: parseFloat(marking.y),
  });
  const [coordinates, setCoordinates] = useState({
    x: parseFloat(marking.x),
    y: parseFloat(marking.y),
  });
  const [scale, setScale] = useState(parseFloat(marking.scale));
  const [rotation, setRotation] = useState(parseFloat(marking.rotation));
  const { run: updateMarking } = useUpdateMarking();

  function handleSaveUpdates(updates) {
    updateMarking({
      markingId: marking.id,
      songId: song.id,
      updates,
    });
  }

  useGesture(
    {
      onDrag: ({ offset: [newX, newY] }) => {
        const calculatedX = newX + initialCoordinates.x;
        const calculatedY = newY + initialCoordinates.y;

        setCoordinates({ x: calculatedX, y: calculatedY });
      },
      onDragEnd: () => handleSaveUpdates(coordinates),
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
      drag: {
        delay: true,
      },
    }
  );

  return (
    <button
      ref={markingRef}
      className="absolute outline-none focus:outline-none whitespace-nowrap"
      style={{
        touchAction: 'none',
        paddingLeft: '30px',
        paddingRight: '30px',
        paddingTop: '15px',
        paddingBottom: '15px',
        transform: `translate(${coordinates.x}px, ${coordinates.y}px) rotate(${rotation}deg) scale(${scale})`,
      }}
    >
      {marking.marking_type === 'shapes' ? (
        <ShapeMarking marking={marking} />
      ) : (
        <div
          className={classNames(
            'text-center',
            marking.marking_type === 'dynamics' && 'font-bold italic'
          )}
          style={{
            fontSize: '60px',
            paddingLeft: '10px',
            paddingRight: '10px',
            fontFamily:
              marking.marking_type === 'dynamics' && 'Times New Roman',
          }}
        >
          {marking.content}
        </div>
      )}
    </button>
  );
}
