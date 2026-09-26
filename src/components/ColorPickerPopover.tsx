import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import StyledPopover from './StyledPopover';
import { RgbaStringColorPicker } from 'react-colorful';
import useAnnotationsToolbar from '../hooks/useAnnotationsToolbar';
import { useDebounce } from 'usehooks-ts';

type ColorPickerPopoverProps = {
  button: ReactNode;
};

export default function ColorPickerPopover({
  button,
}: ColorPickerPopoverProps) {
  const { color: defaultColor, setColor: setAnnotationColor } =
    useAnnotationsToolbar();
  const [color, setColor] = useState(defaultColor);
  // Follow the toolbar's color whenever it changes.
  const [previousDefaultColor, setPreviousDefaultColor] =
    useState(defaultColor);
  if (defaultColor !== previousDefaultColor) {
    setPreviousDefaultColor(defaultColor);
    setColor(defaultColor);
  }

  const debounced = useDebounce(color, 300);

  useEffect(() => {
    setAnnotationColor(debounced);
  }, [debounced, setAnnotationColor]);

  return (
    <StyledPopover button={button} position="top">
      <div className="px-3 py-2 overflow-hidden rounded-lg color-picker sm:w-72 w-80">
        <RgbaStringColorPicker color={color} onChange={setColor} />
      </div>
    </StyledPopover>
  );
}
