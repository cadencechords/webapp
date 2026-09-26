import type { ReactNode } from 'react';

type StackedListItemProps = {
  children: ReactNode;
};

export default function StackedListItem({ children }: StackedListItemProps) {
  return (
    <div className="border-b dark:border-dark-gray-400 py-3 last:border-0">
      {children}
    </div>
  );
}
