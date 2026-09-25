import type { MouseEventHandler, ReactNode } from 'react';

type TransposeOptionProps = {
  selected?: boolean;
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function TransposeOption({
  selected,
  children,
  className = '',
  onClick,
}: TransposeOptionProps) {
  return (
    <button
      onClick={onClick}
      className={
        `focus:outline-hidden outline-hidden bg-gray-100 dark:bg-dark-gray-600 transition-all ` +
        ` font-semibold text-lg h-12 w-12 rounded-md block mb-2 flex-center shrink-0` +
        ` ${selected ? 'bg-blue-600 dark:bg-dark-blue text-white' : ''} ${className}`
      }
    >
      {children}
    </button>
  );
}
