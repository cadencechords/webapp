import React from 'react';
import type { ReactNode } from 'react';

export default function FormatOption({ children }: { children?: ReactNode }) {
  return <div className="my-2 flex-between">{children}</div>;
}
