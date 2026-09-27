import type { ReactNode } from 'react';
import LoadingIndicator from './feedback/LoadingIndicator';

type PageLoadingProps = {
  children?: ReactNode;
};

// A page's loading state: an optional message over the M3E loading indicator.
export default function PageLoading({ children }: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center py-4 text-center">
      {children && <div className="mb-4">{children}</div>}
      <LoadingIndicator />
    </div>
  );
}
