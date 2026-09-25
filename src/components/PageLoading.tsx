import type { ReactNode } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

type PageLoadingProps = {
  children?: ReactNode;
};

export default function PageLoading({ children }: PageLoadingProps) {
  return (
    <div className="text-center py-4">
      {children && <div className="mb-4">{children}</div>}
      <PulseLoader color="#1f6feb" />
    </div>
  );
}
