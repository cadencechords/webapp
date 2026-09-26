import type { ReactNode } from 'react';
import { Textfit } from 'react-textfit';

type TextAutosizeProps = {
  children: ReactNode;
  /** Fits the text to its container; `fontSize` is ignored. */
  autosize?: boolean;
  /** In px. */
  fontSize?: number | string;
};

export default function TextAutosize({
  children,
  autosize,
  fontSize,
}: TextAutosizeProps) {
  if (autosize) {
    return (
      <Textfit mode="single" style={{ height: '100%' }}>
        {children}
      </Textfit>
    );
  } else {
    return <div style={{ fontSize: `${fontSize}px` }}>{children}</div>;
  }
}
