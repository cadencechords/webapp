import React from 'react';
import { useSongOnScreen } from '../hooks/songBeingPresented.hooks';
import CheckIcon from '@heroicons/react/outline/CheckIcon';
import MobileMenuButton from './buttons/MobileMenuButton';
import classNames from 'classnames';

export default function KeyOptionsSheet({ onChangeSheet, className }) {
  const { song } = useSongOnScreen();

  const iconClasses = 'h-4 w-4 text-green-500 dark:text-dark-green ml-2';

  return (
    <div className={classNames(className)}>
      <MobileMenuButton
        size="sm"
        full
        className="border-b rounded-t-md dark:border-dark-gray-400 flex-center"
        onClick={() => onChangeSheet('transpose')}
      >
        Transpose
        {song.show_transposed && song.transposed_key && (
          <CheckIcon className={iconClasses} />
        )}
      </MobileMenuButton>
      <MobileMenuButton
        size="sm"
        full
        className="rounded-b-md flex-center"
        onClick={() => onChangeSheet('capo')}
      >
        Capo
        {song.capo?.capo_key && song.show_capo && (
          <CheckIcon className={iconClasses} />
        )}
      </MobileMenuButton>
    </div>
  );
}
