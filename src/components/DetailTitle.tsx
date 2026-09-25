import type { ReactNode } from 'react';

type DetailTitleProps = {
  children?: ReactNode;
  className?: string;
};

export default function DetailTitle({ children, className }: DetailTitleProps) {
  return (
    <div
      className={`text-gray-600 dark:text-dark-gray-200 text-sm mr-3 ${className}`}
    >
      {children}
    </div>
  );
}
