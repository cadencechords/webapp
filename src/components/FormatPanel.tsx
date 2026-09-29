import { useLayoutEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import FormatPanelChordOptions from './FormatPanelChordOptions';
import FormatPanelGeneralOptions from './FormatPanelGeneralOptions';
import SegmentedControl from './SegmentedControl';
import Button from './Button';
import Icon from './Icon';

/** Where the panel sits: pixels from the viewport's top left corner. */
export type Coordinates = { x: number; y: number };

/** How far the panel can go: the viewport, less the panel's own size. */
type Bounds = { left: number; top: number; right: number; bottom: number };

type FormatPanelProps = {
  onClose: () => void;
  defaultCoordinates: Coordinates;
  onCoordinatesChange: (coordinates: Coordinates) => void;
};

export default function FormatPanel({
  onClose,
  defaultCoordinates,
  onCoordinatesChange,
}: FormatPanelProps) {
  const [selectedTab, setSelectedTab] = useState('General');
  const panelRef = useRef<HTMLElement>(null);
  // Controlled, so a resize can move it back into view.
  const [position, setPosition] = useState(defaultCoordinates);
  // The latest position, for fitting it outside a render.
  const positionRef = useRef(defaultCoordinates);
  const [bounds, setBounds] = useState<Bounds>();

  // The panel is fixed to the viewport. Whenever the window or the panel
  // resizes (a tab's options change its height), fit the drag bounds to the
  // viewport and pull the panel back inside them if it's now out.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    function fit() {
      if (!panel) return;
      const right = Math.max(0, window.innerWidth - panel.offsetWidth);
      const bottom = Math.max(0, window.innerHeight - panel.offsetHeight);
      setBounds({ left: 0, top: 0, right, bottom });
      const current = positionRef.current;
      const fitted = {
        x: clamp(current.x, 0, right),
        y: clamp(current.y, 0, bottom),
      };
      if (fitted.x !== current.x || fitted.y !== current.y) {
        positionRef.current = fitted;
        setPosition(fitted);
        onCoordinatesChange(fitted);
      }
    }

    fit();
    window.addEventListener('resize', fit);
    const observer =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fit);
    observer?.observe(panel);
    return () => {
      window.removeEventListener('resize', fit);
      observer?.disconnect();
    };
  }, [onCoordinatesChange]);

  function handleDrag(_: DraggableEvent, data: DraggableData) {
    positionRef.current = { x: data.x, y: data.y };
    setPosition(positionRef.current);
  }

  function handleDragEnd(_: DraggableEvent, data: DraggableData) {
    onCoordinatesChange({ x: data.x, y: data.y });
  }

  // An M3 floating panel on surface-container-high: a header to drag it by
  // (with a close button), the General/Chords tabs, then that tab's options.
  return (
    <Draggable
      nodeRef={panelRef}
      bounds={bounds}
      handle=".handle"
      axis="both"
      position={position}
      onDrag={handleDrag}
      onStop={handleDragEnd}
    >
      <section
        ref={panelRef}
        aria-label="Format"
        className="fixed top-0 left-0 z-50 w-80 rounded-extra-large bg-surface-container-high text-on-surface shadow-(--md-sys-elevation-level3) select-none font-plain"
      >
        <div className="flex items-center gap-1 py-2 pl-3 pr-2">
          <div className="flex items-center flex-1 gap-2 cursor-move handle">
            <Icon
              name="drag_indicator"
              className="w-5 h-5 text-on-surface-variant"
            />
            <h2 className="text-title-medium">Format</h2>
          </div>
          <Button
            variant="icon"
            color="gray"
            size="md"
            name="Close"
            onClick={onClose}
          >
            <Icon name="close" className="w-5 h-5" />
          </Button>
        </div>
        <div className="px-4 pb-4">
          <SegmentedControl
            options={['General', 'Chords']}
            selected={selectedTab}
            onChange={setSelectedTab}
            name="formatter-segmented-control"
            size="sm"
          />
          <div className="mt-2">
            {selectedTab === 'General' && <FormatPanelGeneralOptions />}
            {selectedTab === 'Chords' && <FormatPanelChordOptions />}
          </div>
        </div>
      </section>
    </Draggable>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
