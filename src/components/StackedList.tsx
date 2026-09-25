import type { ReactElement } from 'react';
import StackedListItem from './StackedListItem';

type StackedListProps = {
  items?: (ReactElement & { id?: number | string })[];
  className?: string;
};

export default function StackedList({
  items,
  className = '',
}: StackedListProps) {
  return (
    <div className={className}>
      {items?.map((item, index) => (
        <StackedListItem key={item.id ? item.id : index}>
          {item}
        </StackedListItem>
      ))}
    </div>
  );
}
