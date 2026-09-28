import React, { useEffect, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import StyledPopover from './StyledPopover';
import { RgbaStringColorPicker } from 'react-colorful';
import useAnnotationsToolbar from '../hooks/useAnnotationsToolbar';
import { useDebounce } from 'usehooks-ts';

type ColorPickerPopoverProps = {
  button: ReactNode;
  /** Classes for the trigger, which is the button (see StyledPopover). */
  buttonClassName?: string;
  buttonProps?: ComponentProps<typeof StyledPopover>['buttonProps'];
};

export default function ColorPickerPopover({
  button,
  buttonClassName,
  buttonProps,
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
    <StyledPopover
      button={button}
      position="top"
      buttonClassName={buttonClassName}
      buttonProps={buttonProps}
    >
      <div className="p-3 color-picker sm:w-72 w-80">
        <RgbaStringColorPicker color={color} onChange={setColor} />
      </div>
    </StyledPopover>
  );
}
