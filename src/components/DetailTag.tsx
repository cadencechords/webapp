import type { ReactNode } from 'react';

type DetailTagProps = {
  children: ReactNode;
};

export default function DetailTag({ children }: DetailTagProps) {
  return (
    // An M3 assist chip: outlined, small corners.
    <span className="flex-center h-8 px-3 rounded-small border border-outline font-plain text-label-large text-on-surface">
      {children}
    </span>
  );
}
