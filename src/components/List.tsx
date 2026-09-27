import classNames from 'classnames';
import type { ReactNode } from 'react';

type ListProps<T> = {
  data?: T[];
  renderItem: (item: T, index: number, items: T[]) => ReactNode;
  ListEmpty?: ReactNode;
  ListHeader?: ReactNode;
  className?: string;
};

export default function List<T>({
  data,
  renderItem,
  ListEmpty,
  ListHeader,
  className,
}: ListProps<T>) {
  return (
    <>
      {ListHeader && <div>{ListHeader}</div>}
      {data?.length ? (
        // A grouped M3 list: each row is a segment.
        <div className={classNames('list-segmented', className)}>
          {data.map(renderItem)}
        </div>
      ) : (
        ListEmpty
      )}
    </>
  );
}
