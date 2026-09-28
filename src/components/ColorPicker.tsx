import React, { useState } from 'react';
import StyledPopover from './StyledPopover';
import { RgbaStringColorPicker } from 'react-colorful';
import Button from './Button';

type ColorPickerProps = {
  /** An `rgba(...)` color. */
  color?: string;
  /** Called with the confirmed color, or with `color` on cancel. */
  onChange: (color: string) => void;
  /** The swatch button's accessible name. */
  label?: string;
  /** A 32dp round swatch, for a row's trailing control. */
  large?: boolean;
};

export default function ColorPicker({
  color = 'rgba(255, 255, 255, 1)',
  onChange,
  label,
  large = false,
}: ColorPickerProps) {
  const [stagedColor, setStagedColor] = useState(color);
  // Start the staged color over whenever the color changes.
  const [previousColor, setPreviousColor] = useState(color);
  if (color !== previousColor) {
    setPreviousColor(color);
    setStagedColor(color);
  }

  function handleConfirm() {
    onChange(stagedColor);
  }

  function handleCancel() {
    setStagedColor(color);
    onChange(color);
  }

  function handleMakeTransparent() {
    setStagedColor('rgba(255, 255, 255, 0)');
  }

  return (
    <StyledPopover
      button={
        <span
          role="img"
          aria-label={label}
          className={
            large
              ? 'block w-8 h-8 rounded-full border border-outline-variant'
              : 'block w-5 h-5 rounded-extra-small border border-outline-variant'
          }
          style={{
            backgroundColor: color,
            backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>')`,
          }}
        />
      }
      buttonClassName={
        large
          ? 'rounded-full outline-hidden focus-ring'
          : 'rounded-extra-small outline-hidden focus-ring'
      }
    >
      <div className="px-2 pt-2">
        <RgbaStringColorPicker color={stagedColor} onChange={setStagedColor} />
      </div>
      <div className="p-2 w-64">
        <Button
          variant="outlined"
          size="xs"
          onClick={handleMakeTransparent}
          className="w-8 h-8"
          style={{
            backgroundColor: '#fff',
            backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>')`,
          }}
        />
        <div className="flex mt-2">
          <Button
            variant="outlined"
            full={true}
            className="mr-1"
            size="xs"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            full={true}
            className="ml-1"
            size="xs"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </StyledPopover>
  );
}
