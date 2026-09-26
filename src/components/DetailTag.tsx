import type { ReactNode } from 'react';

type DetailTagProps = {
  children: ReactNode;
};

export default function DetailTag({ children }: DetailTagProps) {
  return (
    <span className="rounded-full flex-center text-xs px-2 py-1 shadow-xs border border-gray-300 dark:border-dark-gray-400">
      {children}
    </span>
  );
}
