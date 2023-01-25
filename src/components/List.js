import React from 'react';
import FadeIn from './FadeIn';

export default function List({
  data,
  renderItem,
  ListEmpty,
  ListHeader,
  className,
  withFade = false,
}) {
  return (
    <>
      {ListHeader && <div>{ListHeader}</div>}
      {withFade && (
        <FadeIn className={className}>
          {data?.length ? <div>{data.map(renderItem)}</div> : ListEmpty}
        </FadeIn>
      )}
      {!withFade && (
        <>
          {data?.length ? (
            <div className={className}>{data.map(renderItem)}</div>
          ) : (
            ListEmpty
          )}
        </>
      )}
    </>
  );
}
