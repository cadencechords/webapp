import React, { useEffect, useState } from 'react';
import StyledPopover from './StyledPopover';
import { RgbaStringColorPicker } from 'react-colorful';
import useAnnotationsToolbar from '../hooks/useAnnotationsToolbar';
import { useDebounce } from 'usehooks-ts';
import classNames from 'classnames';

export default function StrokeWidthPopover({ button }) {
  const {
    color: defaultColor,
    setColor: setAnnotationColor,
    strokeWidth,
    setStrokeWidth,
  } = useAnnotationsToolbar();
  const [color, setColor] = useState(defaultColor);

  useEffect(() => {
    setColor(defaultColor);
  }, [defaultColor]);

  const debounced = useDebounce(color, 100);

  useEffect(() => {
    setAnnotationColor(debounced);
  }, [debounced, setAnnotationColor]);

  return (
    <StyledPopover button={button} position="top">
      <div className="px-3 py-2 overflow-hidden rounded-lg stroke-width">
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

function StrokeWidthButton({ strokeWidth, selected, onClick }) {
  return (
    <button
      onClick={() => onClick(strokeWidth)}
      className={classNames(
        'w-12 h-12 p-2 flex-center rounded-xl',
        selected && 'bg-gray-100 dark:bg-dark-gray-400'
      )}
    >
      <div
        className={classNames(
          'w-full transform rotate-45 bg-black',
          selected ? 'dark:bg-white' : 'dark:bg-dark-gray-100'
        )}
        style={{ height: strokeWidth }}
      ></div>
    </button>
  );
}
