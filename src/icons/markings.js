import React from 'react';

export function BlockArrow({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        d="m20.707 7.293-4-4a1 1 0 0 0-1.414 0L7 11.586 4.707 9.293A1 1 0 0 0 3 10v10a1 1 0 0 0 1 1h10a1 1 0 0 0 .707-1.707L12.414 17l8.293-8.293a1 1 0 0 0 0-1.414zm-10.414 9a1 1 0 0 0 0 1.414L11.586 19H5v-6.586l1.293 1.293a1 1 0 0 0 1.414 0L16 5.414 18.586 8z"
        fill="currentColor"
        data-name="down-left"
      />
    </svg>
  );
}

export function BoldArrow({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20.018 18"
      className={className}
    >
      <path
        d="M10.018 18v-5h10V5h-10V0L0 8.939 10.018 18z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ShortArrow({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 21 21"
      className={className}
    >
      <path
        d="m12.718 4.707-1.413-1.415L2.585 12l8.72 8.707 1.413-1.415L6.417 13H20v-2H6.416l6.302-6.293z"
        fill="currentColor"
      />
    </svg>
  );
}

export function NarrowArrow({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <path
        d="M31.71 1.71 30.29.29 2 28.59V16H0v15a1 1 0 0 0 1 1h16v-2H3.41z"
        data-name="6-Arrow Down"
        fill="currentColor"
      />
    </svg>
  );
}
