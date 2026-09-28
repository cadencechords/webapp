import React, { useEffect, useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import StyledPopover from './StyledPopover';
import { RgbaStringColorPicker } from 'react-colorful';
import useAnnotationsToolbar from '../hooks/useAnnotationsToolbar';
import { useDebounce } from 'usehooks-ts';
import classNames from 'classnames';

type StrokeWidthPopoverProps = {
  button: ReactNode;
  /** Classes for the trigger, which is the button (see StyledPopover). */
  buttonClassName?: string;
  buttonProps?: ComponentProps<typeof StyledPopover>['buttonProps'];
};

export default function StrokeWidthPopover({
  button,
  buttonClassName,
  buttonProps,
}: StrokeWidthPopoverProps) {
  const {
    color: defaultColor,
    setColor: setAnnotationColor,
    strokeWidth,
    setStrokeWidth,
  } = useAnnotationsToolbar();
  const [color, setColor] = useState(defaultColor);
  // Follow the toolbar's color whenever it changes.
  const [previousDefaultColor, setPreviousDefaultColor] =
    useState(defaultColor);
  if (defaultColor !== previousDefaultColor) {
    setPreviousDefaultColor(defaultColor);
    setColor(defaultColor);
  }

  const debounced = useDebounce(color, 100);

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
      <div className="p-3 stroke-width">
        <div className="flex gap-4 mb-3">
          {WIDTHS.map(width => (
            <StrokeWidthButton
              strokeWidth={width}
              key={width}
              selected={strokeWidth === width}
              onClick={setStrokeWidth}
            />
          ))}
        </div>
        <RgbaStringColorPicker color={color} onChange={setColor} />
      </div>
    </StyledPopover>
  );
}

const WIDTHS = [2, 4, 8, 16, 24];

type StrokeWidthButtonProps = {
  strokeWidth: number;
  selected: boolean;
  /** Called with `strokeWidth`. */
  onClick: (strokeWidth: number) => void;
};

function StrokeWidthButton({
  strokeWidth,
  selected,
  onClick,
}: StrokeWidthButtonProps) {
  return (
    <button
      onClick={() => onClick(strokeWidth)}
      className={classNames(
        'w-12 h-12 p-2 flex-center rounded-medium state-layer-flat focus-ring',
        selected
          ? 'bg-secondary-container text-on-secondary-container'
          : 'text-on-surface'
      )}
    >
      <div
        className="w-full transform rotate-45 bg-current"
        style={{ height: strokeWidth }}
      ></div>
    </button>
  );
}
