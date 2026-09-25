import type { ReactNode } from 'react';

type SectionTitleProps = {
  title?: ReactNode;
  underline?: boolean;
  className?: string;
};

export default function SectionTitle({
  title,
  underline,
  className = '',
}: SectionTitleProps) {
  return (
    <h2
      className={`mt-3 mb-2 font-semibold text-lg ${
        underline ? ' border-b dark:border-dark-gray-600 pb-2' : ''
      } ${className}`}
    >
      {title}
    </h2>
  );
}
