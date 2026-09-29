import React from 'react';
import { Link } from 'react-router-dom';
import { pluralize } from '../utils/StringUtils';
import BinderColor from './BinderColor';
import {
  LIST_ITEM_INTERACTIVE,
  LIST_ITEM_TWO_LINE,
  LIST_SUPPORTING_TEXT,
} from './lists/listItem';
import type { Binder } from '../types';

export default function BinderRow({ binder }: { binder: Binder }) {
  return (
    <Link
      to={{ pathname: `/folders/${binder.id}`, state: binder }}
      className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE}`}
    >
      <BinderColor color={binder.color} />
      <div className="min-w-0">
        <div className="truncate">{binder.name}</div>
        <div className={LIST_SUPPORTING_TEXT}>
          {binder.songs?.length} {pluralize('song', binder.songs?.length)}
        </div>
      </div>
    </Link>
  );
}
