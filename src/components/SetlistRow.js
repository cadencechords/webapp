import React from 'react';
import { Link } from 'react-router-dom';
import { pluralize } from '../utils/StringUtils';
import { format } from '../utils/DateUtils';

export default function SetlistRow({ setlist }) {
  return (
    <Link
      to={{ pathname: `/sets/${setlist.id}`, state: setlist }}
      className="flex flex-col justify-center h-16 px-3 border-b sm:rounded-lg sm:hover:bg-gray-100 dark:hover:bg-dark-gray-800 dark:border-dark-gray-600 last:border-0 sm:border-0"
    >
      <div>{setlist.name}</div>
      <div className="mt-0.5 text-xs text-gray-600 dark:text-dark-gray-200">
        {setlist.songs.length} {pluralize('song', setlist.songs?.length)}
        <span className="px-2">·</span>
        {format('ddd MMM D, YYYY', setlist.scheduled_date)}
      </div>
    </Link>
  );
}
