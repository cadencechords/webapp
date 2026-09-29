import React from 'react';
import { Link } from 'react-router-dom';
import { pluralize } from '../utils/StringUtils';
import { format } from '../utils/DateUtils';
import {
  LIST_ITEM_INTERACTIVE,
  LIST_ITEM_TWO_LINE,
  LIST_SUPPORTING_TEXT,
} from './lists/listItem';
import type { Setlist } from '../types';

export default function SetlistRow({ setlist }: { setlist: Setlist }) {
  // Non-null (setlist.songs! below): kept as before; the sets index comes with
  // each set's songs.
  return (
    <Link
      to={{ pathname: `/sets/${setlist.id}`, state: setlist }}
      className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE}`}
    >
      <div className="min-w-0">
        <div className="truncate">{setlist.name}</div>
        <div className={LIST_SUPPORTING_TEXT}>
          {setlist.songs!.length} {pluralize('song', setlist.songs?.length)}
          <span className="px-2">·</span>
          {format('ddd MMM D, YYYY', setlist.scheduled_date)}
        </div>
      </div>
    </Link>
  );
}
