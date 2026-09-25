import type { ReactNode } from 'react';
import TableHead from './TableHead';
import TableRow from './TableRow';

type TableProps = {
  headers?: ReactNode[];
  /** Each row's values, in column order. */
  rows?: Record<string, ReactNode>[];
};

export default function Table({ headers = [], rows = [] }: TableProps) {
  const toColumnsArray = (row: Record<string, ReactNode>) => {
    return Object.values(row);
  };

  return (
    <table className="w-full">
      <TableHead columns={headers} />
      <tbody>
        {rows.map((row, index) => (
          <TableRow key={index} columns={toColumnsArray(row)} />
        ))}
      </tbody>
    </table>
  );
}
