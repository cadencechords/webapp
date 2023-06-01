import React from 'react';
import useAnnotationsToolbar from '../hooks/useAnnotationsToolbar';
import usePerformanceMode from '../hooks/usePerformanceMode';
import {
  HighlighterIcon,
  PencilIcon,
  ScrollIcon,
  EraserIcon,
} from '../icons/AnnotationIcons';
import classNames from 'classnames';
import StrokeWidthPopover from './StrokeWidthPopover';
import * as colorUtils from '../utils/color.utils';
import ColorPickerPopover from './ColorPickerPopover';

export default function AnnotationsToolbar() {
  const { isAnnotating } = usePerformanceMode();
  const { color, utensil, setUtensil, setStrokeWidth, setColor } =
    useAnnotationsToolbar();

  function handleHighlighterClick() {
    if (utensil === 'highlighter') {
    } else {
      setColor(colorUtils.setAlpha(color, 0.5));
      setStrokeWidth(16);
      setUtensil('highlighter');
    }
  }

  function handlePenClick() {
    if (utensil === 'pen') {
    } else {
      setColor(colorUtils.setAlpha(color, 1));
      setStrokeWidth(2);
      setUtensil('pen');
    }
  }

  if (!isAnnotating) return null;

  return (
    <div className="fixed z-30 w-full h-16 max-w-md px-2 transform -translate-x-1/2 bg-transparent left-1/2 bottom-5">
      <div className="w-full h-full bg-gray-100 dark:bg-dark-gray-700 rounded-xl flex-around">
        <UtensilButton
          Icon={ScrollIcon}
          name="scroll"
          selectedUtensil={utensil}
          onClick={setUtensil}
        />
        {utensil === 'highlighter' ? (
          <StrokeWidthPopover
            button={
              <UtensilButton
                Icon={HighlighterIcon}
                name="highlighter"
                selectedUtensil={utensil}
                onClick={handleHighlighterClick}
              />
            }
          />
        ) : (
          <UtensilButton
            Icon={HighlighterIcon}
            name="highlighter"
            selectedUtensil={utensil}
            onClick={handleHighlighterClick}
          />
        )}
        {utensil === 'pen' ? (
          <StrokeWidthPopover
            button={
              <UtensilButton
                Icon={PencilIcon}
                name="pen"
                selectedUtensil={utensil}
                onClick={handlePenClick}
              />
            }
          />
        ) : (
          <UtensilButton
            Icon={PencilIcon}
            name="pen"
            selectedUtensil={utensil}
            onClick={handlePenClick}
          />
        )}

        <UtensilButton
          Icon={EraserIcon}
          name="eraser"
          selectedUtensil={utensil}
          onClick={setUtensil}
        />
        <ColorPickerPopover button={<ColorButton color={color} />} />
      </div>
    </div>
  );
}

function UtensilButton({ Icon, onClick, selectedUtensil, name }) {
  return (
    <button
      onClick={() => onClick(name)}
      className={classNames(
        'flex-col gap-1 flex-center',
        name === selectedUtensil && 'text-blue-600 dark:text-dark-blue'
      )}
    >
      <Icon className="w-7 h-7" />
      <span className="text-xs">{name}</span>
    </button>
  );
}

function ColorButton({ color }) {
  return (
    <button
      className="w-8 h-8 border rounded-full dark:border-dark-gray-600"
      style={{ backgroundColor: color }}
    ></button>
  );
}
