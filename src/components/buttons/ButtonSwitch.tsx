import type { ReactNode } from 'react';
import classNames from 'classnames';
import {
  connectedButtonClasses,
  connectedGroupClasses,
} from './connectedButtonGroup';

type ButtonSwitchProps = {
  activeButtonLabel: string;
  buttonLabels: string[];
  /** Called with the clicked label; the active one isn't clickable. */
  onClick: (label: string) => void;
};

export default function ButtonSwitch({
  activeButtonLabel,
  buttonLabels,
  onClick,
}: ButtonSwitchProps) {
  return (
    <div className={classNames(connectedGroupClasses, 'shrink-0')}>
      {buttonLabels.map((label, index) => (
        <ButtonSwitchOption
          key={index}
          index={index}
          count={buttonLabels.length}
          active={label === activeButtonLabel}
          onClick={() => onClick(label)}
        >
          {label}
        </ButtonSwitchOption>
      ))}
    </div>
  );
}

type ButtonSwitchOptionProps = {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
  /** Position in the group, which sets the corners. */
  index: number;
  count: number;
};

export function ButtonSwitchOption({
  children,
  active,
  onClick,
  index,
  count,
}: ButtonSwitchOptionProps) {
  const className = classNames(
    connectedButtonClasses({ index, count, selected: active, size: 'xs' }),
    'text-label-medium'
  );
  if (active) {
    return <button className={className}>{children}</button>;
  } else {
    return (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    );
  }
}
