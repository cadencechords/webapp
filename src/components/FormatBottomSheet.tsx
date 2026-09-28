import { useState } from 'react';
import BottomSheet from './BottomSheet';
import FormatPanelChordOptions from './FormatPanelChordOptions';
import FormatPanelGeneralOptions from './FormatPanelGeneralOptions';
import SegmentedControl from './SegmentedControl';

type FormatBottomSheetProps = {
  show: boolean;
  onClose: () => void;
};

export default function FormatBottomSheet({
  show,
  onClose,
}: FormatBottomSheetProps) {
  const [selectedTab, setSelectedTab] = useState('General');

  // The panel's options in a bottom sheet, for phones.
  return (
    <BottomSheet open={show} onClose={onClose} className="px-4 pb-6 font-plain">
      <h2 className="pt-2 pb-4 text-title-large text-on-surface">Format</h2>
      <SegmentedControl
        options={['General', 'Chords']}
        onChange={setSelectedTab}
        selected={selectedTab}
        name="formatter-bottom-sheet-segmented-control"
      />
      <div className="mt-2">
        {selectedTab === 'General' && <FormatPanelGeneralOptions />}
        {selectedTab === 'Chords' && <FormatPanelChordOptions />}
      </div>
    </BottomSheet>
  );
}
