import type { ReactNode } from 'react';
import classNames from 'classnames';
import {
  connectedButtonClasses,
  connectedGroupClasses,
  type ConnectedButtonSize,
} from './connectedButtonGroup';

type ButtonSwitchProps = {
  activeButtonLabel: string;
  buttonLabels: string[];
  /** Called with the clicked label; the active one isn't clickable. */
  onClick: (label: string) => void;
  /** 32px (the default) or 40px tall. */
  size?: ConnectedButtonSize;
};

export default function ButtonSwitch({
  activeButtonLabel,
  buttonLabels,
  onClick,
  size = 'xs',
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
          size={size}
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
  size?: ConnectedButtonSize;
};

export function ButtonSwitchOption({
  children,
  active,
  onClick,
  index,
  count,
  size = 'xs',
}: ButtonSwitchOptionProps) {
  const className = classNames(
    connectedButtonClasses({ index, count, selected: active, size }),
    size === 'xs' ? 'text-label-medium' : 'text-label-large'
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
