import type { ReactNode } from 'react';

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
    <div className="flex shrink-0 p-1 bg-gray-100 border border-gray-100 rounded-full dark:bg-dark-gray-800 dark:border-dark-gray-600">
      {buttonLabels.map((label, index) => (
        <ButtonSwitchOption
          key={index}
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
};

export function ButtonSwitchOption({
  children,
  active,
  onClick,
}: ButtonSwitchOptionProps) {
  const baseButtonClasses =
    'outline-hidden focus:outline-hidden flex-1 text-xs text-gray-600 dark:text-dark-gray-100 font-semibold ';
  if (active) {
    return (
      <button
        className={
          'bg-white dark:bg-dark-gray-400 py-1 flex-1 rounded-full shadow-xs ' +
          baseButtonClasses
        }
      >
        {children}
      </button>
    );
  } else {
    return (
      <button className={'flex-1 ' + baseButtonClasses} onClick={onClick}>
        {children}
      </button>
    );
  }
}
