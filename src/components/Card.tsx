import type { MouseEventHandler, ReactNode } from 'react';

type CardProps = {
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`rounded-md bg-gray-50 py-3 px-5 relative ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
