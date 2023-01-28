import React from 'react';

export default function List({
  data,
  renderItem,
  ListEmpty,
  ListHeader,
  className,
}) {
  return (
    <>
      {ListHeader && <div>{ListHeader}</div>}
      {data?.length ? (
        <div className={className}>{data.map(renderItem)}</div>
      ) : (
        ListEmpty
      )}
    </>
  );
}
