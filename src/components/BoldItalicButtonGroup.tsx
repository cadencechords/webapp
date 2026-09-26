import React from 'react';
import BoldIcon from '../icons/BoldIcon';
import ItalicIcon from '../icons/ItalicIcon';
import ButtonGroup from './ButtonGroup';
import type { ButtonGroupChange, ButtonGroupOption } from './ButtonGroup';

/** The format fields the buttons toggle. */
export type ChordStyle = 'bold_chords' | 'italic_chords';

type BoldItalicButtonGroupProps = {
  isBold?: boolean;
  isItalic?: boolean;
  onChange?: (field: ChordStyle, selected: boolean) => void;
};

export default function BoldItalicButtonGroup({
  isBold,
  isItalic,
  onChange,
}: BoldItalicButtonGroupProps) {
  const selections = [
    isBold && 'bold_chords',
    isItalic && 'italic_chords',
  ].filter((selectedValue): selectedValue is ChordStyle => !!selectedValue);

  function handleChange({ selected, option }: ButtonGroupChange<ChordStyle>) {
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

const OPTIONS: ButtonGroupOption<ChordStyle>[] = [
  {
    value: 'bold_chords',
    display: <BoldIcon className="w-5 h-5" />,
  },
  {
    value: 'italic_chords',
    display: <ItalicIcon className="w-5 h-5" />,
  },
];
