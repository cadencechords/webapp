import type { ReactNode } from 'react';

type TableHeadProps = {
  columns?: ReactNode[];
  /** Adds an empty header cell for the rows' edit controls. */
  editable?: boolean;
};

export default function TableHead({ columns, editable }: TableHeadProps) {
  return (
    <thead className="bg-gray-50 dark:bg-dark-gray-800 text-gray-600 dark:text-dark-gray-200 text-xs border-t border-b dark:border-dark-gray-700 font-light tracking-wide">
      <tr>
        {columns?.map((column, index) => (
          <th className="py-1 px-2 mx-3 text-left" key={index}>
            {column}
          </th>
        ))}

        {editable && (
          <th className="bg-gray-50 dark:bg-dark-gray-800 border-t border-b dark:border-dark-gray-700"></th>
        )}
      </tr>
    </thead>
  );
}
