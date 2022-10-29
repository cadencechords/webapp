import React, { useState } from 'react';
import BottomSheet from './BottomSheet';
import FormatBottomSheetChordOptions from './FormatBottomSheetChordOptions';
import FormatBottomSheetGeneralOptions from './FormatBottomSheetGeneralOptions';
import SegmentedControl from './SegmentedControl';

export default function FormatBottomSheet({ show, onClose }) {
  const [selectedTab, setSelectedTab] = useState('General');

  return (
    <BottomSheet open={show} onClose={onClose} className="h-64">
      <div className="px-4 pt-4 text-lg font-semibold">Formatting</div>
      <div className="p-4 pt-5">
        <SegmentedControl
          options={['General', 'Chords']}
          onChange={setSelectedTab}
          selected={selectedTab}
          name="formatter-bottom-sheet-segmented-control"
        />
      </div>

      {selectedTab === 'General' && <FormatBottomSheetGeneralOptions />}
      {selectedTab === 'Chords' && <FormatBottomSheetChordOptions />}
    </BottomSheet>
  );
}
