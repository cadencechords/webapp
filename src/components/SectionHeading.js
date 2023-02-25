import classNames from 'classnames';
import React from 'react';

export default function SectionHeading({ heading, withBorder, className }) {
  return (
    <h2
      className={classNames(
        'pt-3 mb-3 text-lg font-semibold dark:border-dark-gray-600',
        withBorder && 'border-t',
        className
      )}
    >
      {heading}
    </h2>
  );
}
