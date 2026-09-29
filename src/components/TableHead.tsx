import type { ReactNode } from 'react';

type TableHeadProps = {
  columns?: ReactNode[];
  /** Adds an empty header cell for the rows' edit controls. */
  editable?: boolean;
};

export default function TableHead({ columns, editable }: TableHeadProps) {
  return (
    <thead className="bg-surface-container font-plain text-label-medium text-on-surface-variant border-y border-outline-variant">
      <tr>
        {columns?.map((column, index) => (
          <th className="px-2 py-2 font-medium text-left" key={index}>
            {column}
          </th>
        ))}

        {editable && <th></th>}
      </tr>
    </thead>
  );
}
