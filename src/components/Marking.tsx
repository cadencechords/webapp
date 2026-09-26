import React, { useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, RefObject } from 'react';
import { useGesture } from 'react-use-gesture';
import {
  useDeleteMarking,
  useUpdateMarking,
} from '../hooks/api/markings.hooks';
import classNames from 'classnames';
import ShapeMarking from './ShapeMarking';
import MarkingOptionsPopover from './MarkingOptionsPopover';
import Draggable from 'react-draggable';
import type { Marking as MarkingModel, Song } from '../types';

type MarkingProps = {
  marking: MarkingModel;
  song: Pick<Song, 'id'>;
  /** Called with the marking's id once it's deleted. */
  onDeleted: (markingId: number) => void;
};

type MarkingUpdates = Partial<Omit<MarkingModel, 'id'>>;

export default function Marking({ marking, song, onDeleted }: MarkingProps) {
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  // A RefObject for ShapeMarking's svg or the text's div, whichever renders.
  // Its current is undefined rather than null until React sets it on mount,
  // and nothing reads it before then: react-use-gesture reads it in an
  // effect, after the mount.
  const markingRef = useRef() as RefObject<SVGSVGElement & HTMLDivElement>;
  // The `as string`s: parseFloat converts its argument to a string first, so
  // a number, a numeric string or undefined parses as it did in the JS.
  const [initialCoordinates] = useState({
    x: parseFloat(marking.x as string),
    y: parseFloat(marking.y as string),
  });

  const [scale, setScale] = useState(parseFloat(marking.scale as string));
  const [rotation, setRotation] = useState(
    parseFloat(marking.rotation as string)
  );
  const { run: updateMarking } = useUpdateMarking();
  const { run: deleteMarking } = useDeleteMarking({
    onSuccess: () => onDeleted(marking.id),
  });

  function handleSaveUpdates(updates: MarkingUpdates) {
    updateMarking({
      markingId: marking.id,
      songId: song.id,
      updates,
    });
  }

  function handleClick(e: MouseEvent<HTMLDivElement>) {
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
        const updates: MarkingUpdates = { rotation: newRotation };
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
            // `as CSSProperties`: fontFamily is false for other markings, and
            // React renders a boolean style value as no value, like undefined.
            style={
              {
                touchAction: 'none',
                paddingLeft: '40px',
                paddingRight: '40px',
                paddingTop: '15px',
                paddingBottom: '15px',
                fontSize: '60px',
                fontFamily:
                  marking.marking_type === 'dynamics' && 'Times New Roman',
                transform: `rotate(${rotation}deg) scale(${scale})`,
              } as CSSProperties
            }
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
