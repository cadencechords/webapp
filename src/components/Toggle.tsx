import type { ReactNode } from 'react';
import { BUTTON_COLORS, type ButtonColor } from './Button';
import { Switch } from '@headlessui/react';
import classNames from 'classnames';

type ToggleProps = {
  enabled?: boolean;
  onChange?: (enabled: boolean) => void;
  label?: ReactNode;
  color?: ButtonColor;
  spacing?: keyof typeof SPACING;
  /** Classes for the row holding the label and switch. */
  className?: string;
  /** Classes for the label, which toggles the switch when clicked. */
  labelClassName?: string;
  /** Can't be toggled: the switch dims to 38%. */
  disabled?: boolean;
};

export default function Toggle({
  enabled,
  onChange,
  label,
  color = 'blue',
  spacing = 'none',
  className = '',
  labelClassName = 'mr-4',
  disabled = false,
}: ToggleProps) {
  return (
    <Switch.Group>
      <div
        className={classNames('flex items-center', SPACING[spacing], className)}
      >
        <Switch.Label className={labelClassName}>{label}</Switch.Label>
        {/* An M3 switch a step under the spec's 52x32: a 46x28 track; the
            thumb grows from 14px to 20px when selected, and to 24px while
            pressed. */}
        <Switch
          checked={enabled}
          onChange={onChange}
          disabled={disabled}
          className={classNames(
            'group relative inline-flex shrink-0 items-center w-[46px] h-7 rounded-full border-2 focus-ring transition-fast-effects disabled:opacity-38',
            enabled
              ? classNames(BUTTON_COLORS[color].filled, 'border-transparent')
              : 'bg-surface-container-highest border-outline'
          )}
        >
          <span
            className={classNames(
              'absolute top-1/2 -translate-y-1/2 rounded-full transition-fast-spatial',
              enabled
                ? 'left-5 w-5 h-5 bg-current group-active:left-[18px] group-active:w-6 group-active:h-6'
                : 'left-[5px] w-3.5 h-3.5 bg-outline group-active:left-0 group-active:w-6 group-active:h-6'
            )}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
}

const SPACING = {
  between: 'justify-between',
  none: '',
};
