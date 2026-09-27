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
};

export default function Toggle({
  enabled,
  onChange,
  label,
  color = 'blue',
  spacing = 'none',
}: ToggleProps) {
  return (
    <Switch.Group>
      <div className={`flex items-center ${SPACING[spacing]}`}>
        <Switch.Label className="mr-4">{label}</Switch.Label>
        {/* M3 switch: a 52x32 track; the thumb grows from 16px to 24px
            when selected, and to 28px while pressed. */}
        <Switch
          checked={enabled}
          onChange={onChange}
          className={classNames(
            'group relative inline-flex shrink-0 items-center w-13 h-8 rounded-full border-2 focus-ring transition-fast-effects',
            enabled
              ? classNames(BUTTON_COLORS[color].filled, 'border-transparent')
              : 'bg-surface-container-highest border-outline'
          )}
        >
          <span
            className={classNames(
              'absolute top-1/2 -translate-y-1/2 rounded-full transition-fast-spatial',
              enabled
                ? 'left-[22px] w-6 h-6 bg-current group-active:left-5 group-active:w-7 group-active:h-7'
                : 'left-1.5 w-4 h-4 bg-outline group-active:left-0 group-active:w-7 group-active:h-7'
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
