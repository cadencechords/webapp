import React, { useState } from 'react';
import FormatBottomSheet from './FormatBottomSheet';
import FormatPanel from './FormatPanel';
import type { Coordinates } from './FormatPanel';

type EditorFormatOptionsProps = {
  show: boolean;
  onClose: () => void;
};

export default function EditorFormatOptions({
  show,
  onClose,
}: EditorFormatOptionsProps) {
  const [formatPanelCoordinates, setFormatPanelCoordinates] =
    useState<Coordinates>({
      x: 100,
      y: 100,
    });

  return show ? (
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
  ) : null;
}
