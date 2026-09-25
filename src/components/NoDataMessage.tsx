import type { ReactNode } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';

type NoDataMessageProps = {
  /** What there's none of, e.g. "songs" shows "No songs to show". */
  type?: string;
  children?: ReactNode;
  loading?: boolean;
};

export default function NoDataMessage({
  type,
  children,
  loading,
}: NoDataMessageProps) {
  if (loading) {
    return (
      <div className="text-center">
        <PulseLoader color="#1f6feb" size={8} />
      </div>
    );
  } else if (type) {
    return (
      <div className="text-center p-2 text-sm text-gray-500 dark:text-dark-gray-200">
        No {type} to show
      </div>
    );
  } else if (children) {
    return (
      <div className="text-center p-2  text-sm text-gray-500 dark:text-dark-gray-200">
        {children}
      </div>
    );
  } else {
    return (
      <div className="text-center p-2  text-sm text-gray-500 dark:text-dark-gray-200">
        No items to show
      </div>
    );
  }
}
