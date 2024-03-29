import React from 'react';

export default function ItalicIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M10,4V7H12.21L8.79,15H6V18H14V15H11.79L15.21,7H18V4H10Z"
      />
    </svg>
  );
}
