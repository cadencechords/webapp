import React, { useState } from 'react';
import FormatBottomSheet from './FormatBottomSheet';
import FormatPanel from './FormatPanel';

export default function EditorFormatOptions({ show, onClose }) {
  const [formatPanelCoordinates, setFormatPanelCoordinates] = useState({
    x: 100,
    y: 100,
  });

  return (
    show && (
      <>
        <div className="hidden md:block">
          <FormatPanel
            onClose={onClose}
            defaultCoordinates={formatPanelCoordinates}
            onCoordinatesChange={setFormatPanelCoordinates}
          />
        </div>
        <div className="md:hidden">
          <FormatBottomSheet show={show} onClose={onClose} />
        </div>
      </>
    )
  );
}
