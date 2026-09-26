import React, { useState } from 'react';
import Draggable from 'react-draggable';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import FormatPanelChordOptions from './FormatPanelChordOptions';
import FormatPanelGeneralOptions from './FormatPanelGeneralOptions';
import SegmentedControl from './SegmentedControl';
import Icon from './Icon';

/** Where the panel sits, in pixels from where it starts. */
export type Coordinates = { x: number; y: number };

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

  function handleDragEnd(_: DraggableEvent, data: DraggableData) {
    const newCoordinates = { x: data.x, y: data.y };
    onCoordinatesChange(newCoordinates);
  }

  return (
    <Draggable
      bounds="html"
      handle=".handle"
      axis="both"
      defaultPosition={defaultCoordinates}
      onStop={handleDragEnd}
    >
      <div className="absolute z-50 w-64 bg-white rounded-lg shadow-md select-none dark:bg-dark-gray-700 h-80">
        <div className="items-center px-3 py-2 text-sm font-semibold text-white bg-gray-700 border-b rounded-md rounded-b-none dark:bg-dark-gray-800 dark:border-dark-gray-700 flex-between">
          <div className="flex-1 cursor-move handle">Formatting</div>
          <div>
            <button
              className="w-6 flex-center focus:outline-hidden"
              onClick={onClose}
            >
              <Icon name="close" filled className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        <div className="p-2">
          <div className="mb-4">
            <SegmentedControl
              options={['General', 'Chords']}
              selected={selectedTab}
              onChange={setSelectedTab}
              name="formatter-segmented-control"
              size="sm"
            />
          </div>

          {selectedTab === 'General' && <FormatPanelGeneralOptions />}
          {selectedTab === 'Chords' && <FormatPanelChordOptions />}
        </div>
      </div>
    </Draggable>
  );
}
