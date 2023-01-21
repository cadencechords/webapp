import React from 'react';

export default function List({ data, renderItem, ListEmpty, ListHeader }) {
  return (
    <>
      {ListHeader && <div>{ListHeader}</div>}
      {data?.length ? <div>{data.map(renderItem)}</div> : ListEmpty}
    </>
  );
}
