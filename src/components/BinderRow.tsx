import React from 'react';
import { Link } from 'react-router-dom';
import { pluralize } from '../utils/StringUtils';
import BinderColor from './BinderColor';

export default function BinderRow({ binder }) {
  return (
    <Link
      to={{ pathname: `/binders/${binder.id}`, state: binder }}
      className="flex items-center h-16 px-3 border-b sm:rounded-lg sm:hover:bg-gray-100 sm:dark:hover:bg-dark-gray-800 dark:border-dark-gray-600 last:border-0 sm:border-0"
    >
      <BinderColor color={binder.color} />
      <div className="ml-4">
        <div>{binder.name}</div>
        <div className="mt-0.5 text-xs text-gray-700 dark:text-dark-gray-200">
          {binder.songs?.length} {pluralize('song', binder.songs?.length)}
        </div>
      </div>
    </Link>
  );
}
