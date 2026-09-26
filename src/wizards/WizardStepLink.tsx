import type { MouseEventHandler, ReactNode } from 'react';

type WizardStepLinkProps = {
  children?: ReactNode;
  className?: string;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function WizardStepLink({
  children,
  className,
  active,
  onClick,
}: WizardStepLinkProps) {
  return (
    <button
      className={
        `focus:outline-hidden outline-hidden rounded-md font-semibold text-left p-2 transition-colors text-sm` +
        ` ${
          active
            ? 'bg-blue-100 text-blue-900'
            : 'text-gray-600 hover:bg-gray-100 focus:bg-gray-100'
        } ${className}`
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}
