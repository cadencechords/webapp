import type { ReactNode } from 'react';

type StackedListItemProps = {
  children: ReactNode;
};

export default function StackedListItem({ children }: StackedListItemProps) {
  return (
    <div className="px-3 py-3 font-plain text-body-large text-on-surface">
      {children}
    </div>
  );
}
