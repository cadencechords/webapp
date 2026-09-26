import classNames from 'classnames';
import type { ReactNode } from 'react';

type SectionHeadingProps = {
  heading?: ReactNode;
  withBorder?: boolean;
  className?: string;
};

export default function SectionHeading({
  heading,
  withBorder,
  className,
}: SectionHeadingProps) {
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
