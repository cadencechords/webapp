import React from 'react';
import CheckIcon from '@heroicons/react/outline/CheckIcon';
import MobileMenuButton from './buttons/MobileMenuButton';
import classNames from 'classnames';

export default function KeyOptionsSheet({ onChangeSheet, className, song }) {
  const iconClasses = 'h-5 w-5 text-green-500 dark:text-dark-green ml-2';

  return (
    <div className={classNames(className)}>
      <MobileMenuButton
        size="sm"
        full
        className="border-b rounded-t-md dark:border-dark-gray-400 flex-between"
        onClick={() => onChangeSheet('transpose')}
      >
        <span className="flex-center">
          Transpose
          {song.transposed_key && (
            <span className="ml-1 text-xs">({song.transposed_key})</span>
          )}
        </span>
        {song.show_transposed && song.transposed_key && (
          <CheckIcon className={iconClasses} />
        )}
      </MobileMenuButton>
      <MobileMenuButton
        size="sm"
        full
        className="rounded-b-md flex-between"
        onClick={() => onChangeSheet('capo')}
      >
        <span className="flex-center">
          Capo
          {song.capo?.capo_key && (
            <span className="ml-1 text-xs">({song.capo.capo_key})</span>
          )}
        </span>
        {song.capo?.capo_key && song.show_capo && (
          <CheckIcon className={iconClasses} />
        )}
      </MobileMenuButton>
    </div>
  );
}
