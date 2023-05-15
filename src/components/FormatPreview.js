import React from 'react';
import { html } from '../utils/SongUtils';
import classNames from 'classnames';
import Badge from './Badge';

export default function FormatPreview({
  format,
  selected,
  onChange,
  disabled,
}) {
  return (
    <button
      className="flex-shrink-0 text-left w-96"
      onClick={() => onChange(selected ? null : format)}
      disabled={disabled}
    >
      <div
        className={classNames(
          'p-4 mb-2 relative overflow-y-hidden rounded-xl h-96 bg-gray-50 dark:bg-dark-gray-800',
          selected && 'ring-2 ring-blue-500 dark:ring-dark-blue'
        )}
      >
        {html({ content: testContent, format })}
        {selected && <Badge className="absolute top-5 right-5">Default</Badge>}
      </div>
      <div className="text-sm text-center">{format.name}</div>
    </button>
  );
}

const testContent = `[Refrain]
 G      G7          
 Amazing Grace! 
     C         G
How sweet the sound
                         D
That saved a wretch like me!
  G        G7   
I once was lost, 
     C      G
But now am found,
    Em         D     G
Was blind, but now I see.`;
