import React, { useEffect, useState } from 'react';
import StyledPopover from './StyledPopover';
import { RgbaStringColorPicker } from 'react-colorful';
import Button from './Button';

export default function ColorPicker({
  color = 'rgba(255, 255, 255, 1)',
  onChange,
}) {
  const [stagedColor, setStagedColor] = useState(color);

  useEffect(() => {
    setStagedColor(color);
  }, [color]);

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
        <button
          className="w-5 h-5 rounded-md border border-gray-300 dark:border-dark-gray-400"
          style={{
            backgroundColor: color,
            backgroundImage: `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill-opacity=".05"><path d="M8 0h8v8H8zM0 8h8v8H0z"/></svg>')`,
          }}
        ></button>
      }
    >
      <RgbaStringColorPicker color={stagedColor} onChange={setStagedColor} />
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
