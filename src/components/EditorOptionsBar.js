import Button from './Button';
import ChordOption from './ChordOption';
import FontSizesListBox from './FontSizesListBox';
import FontsListBox from './FontsListBox';
import PencilAltIcon from '@heroicons/react/outline/PencilAltIcon';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import { useSelector } from 'react-redux';
import ColorPicker from './ColorPicker';

export default function EditorOptionsBar({
  formatOptions,
  onFormatChange,
  onAddNote,
}) {
  const currentSubscription = useSelector(selectCurrentSubscription);

  return (
    <div className="flex items-center">
      <div className="px-3 border-r border-gray-300 dark:border-dark-gray-600 w-32 relative">
        <FontsListBox
          selectedFont={formatOptions.font}
          onChange={newValue => onFormatChange('font', newValue)}
        />
      </div>

      <div className="px-3 relative w-24 border-r border-gray-300 dark:border-dark-gray-600">
        <FontSizesListBox
          selectedFontSize={formatOptions.font_size}
          onChange={newValue => onFormatChange('font_size', newValue)}
        />
      </div>
      <div className="px-3 w-32">
        <ChordOption
          optionName="Bold chords"
          on={formatOptions.bold_chords}
          onChange={newValue => onFormatChange('bold_chords', newValue)}
        />
      </div>
      <div className="px-3 w-32">
        <ChordOption
          optionName="Italic chords"
          on={formatOptions.italic_chords}
          onChange={newValue => onFormatChange('italic_chords', newValue)}
        />
      </div>
      <div className="px-3 w-40">
        <ChordOption optionName="Highlight color">
          <ColorPicker
            color={formatOptions.highlight_color}
            onChange={newValue => onFormatChange('highlight_color', newValue)}
          />
        </ChordOption>
      </div>
      <div className="px-3 w-36 border-r border-gray-300 dark:border-dark-gray-600">
        <ChordOption optionName="Chord color">
          <ColorPicker
            color={formatOptions.chord_color}
            onChange={newValue => onFormatChange('chord_color', newValue)}
          />
        </ChordOption>
      </div>
      {currentSubscription.isPro && (
        <Button
          className="mx-3 bg-white dark:bg-transparent flex-center"
          variant="outlined"
          color="black"
          onClick={onAddNote}
        >
          <PencilAltIcon className="h-4 w-4 text-blue-600 dark:text-dark-blue mr-2" />
          Add note
        </Button>
      )}
    </div>
  );
}
