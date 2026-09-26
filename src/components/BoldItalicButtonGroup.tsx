import React from 'react';
import BoldIcon from '../icons/BoldIcon';
import ItalicIcon from '../icons/ItalicIcon';
import ButtonGroup from './ButtonGroup';

export default function BoldItalicButtonGroup({ isBold, isItalic, onChange }) {
  const selections = [
    isBold && 'bold_chords',
    isItalic && 'italic_chords',
  ].filter(selectedValue => !!selectedValue);

  function handleChange({ selected, option }) {
    onChange?.(option.value, selected);
  }

  return (
    <ButtonGroup
      options={OPTIONS}
      selected={selections}
      onChange={handleChange}
    />
  );
}

const OPTIONS = [
  {
    value: 'bold_chords',
    display: <BoldIcon className="w-5 h-5" />,
  },
  {
    value: 'italic_chords',
    display: <ItalicIcon className="w-5 h-5" />,
  },
];
