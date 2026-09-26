import React from 'react';
import { Link } from 'react-router-dom';
import DetailTitle from './DetailTitle';
import EditableData from './inputs/EditableData';

type LastScheduledFieldProps = {
  /** The latest past setlist with the song, and its formatted date. */
  latestSetlist?: { id: number; date: string };
};

export default function LastScheduledField({
  latestSetlist,
}: LastScheduledFieldProps) {
  return (
    <div className="flex flex-row items-center mb-1">
      <DetailTitle>Last scheduled:</DetailTitle>
      <EditableData
        value={
          latestSetlist ? (
            <Link to={`/sets/${latestSetlist.id}`}>{latestSetlist.date}</Link>
          ) : (
            'Never'
          )
        }
        editable={false}
      />
    </div>
  );
}
