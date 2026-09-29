import { Link } from 'react-router-dom';
import { buttonClasses } from './Button';
import Icon from './Icon';
import NoDataMessage from './NoDataMessage';
import SectionTitle from './SectionTitle';
import { LIST_ITEM_TWO_LINE, LIST_SUPPORTING_TEXT } from './lists/listItem';
import { pluralize } from '../utils/StringUtils';
import type { Setlist } from '../types';

// Today's sets as M3E two-line items in a segmented list: the set's name and
// song count, opening the set, with Perform at the end for a set with songs.
export default function DashboardTodaysSetlists({
  setlists,
}: {
  setlists?: Setlist[];
}) {
  return (
    <section>
      <SectionTitle title="Today's sets" />

      {setlists && setlists.length > 0 ? (
        <div className="list-segmented">
          {setlists.map(setlist => {
            const songCount = setlist.scheduled_songs?.length ?? 0;
            return (
              // A link stretched over the row opens the set, under Perform
              // (a link can't hold another).
              <div
                key={setlist.id}
                className={`${LIST_ITEM_TWO_LINE} relative state-layer-flat list-item-motion`}
              >
                <Icon
                  name="queue_music"
                  filled
                  className="w-6 h-6 shrink-0 text-on-surface-variant"
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{setlist.name}</div>
                  <div className={LIST_SUPPORTING_TEXT}>
                    {songCount} {pluralize('song', songCount)}
                  </div>
                </div>
                <Link
                  to={`/sets/${setlist.id}`}
                  aria-label={setlist.name}
                  className="absolute inset-0 rounded-[inherit] outline-none focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-secondary focus-visible:-outline-offset-3"
                />
                {songCount > 0 && (
                  <Link
                    to={`/sets/${setlist.id}/present`}
                    className={buttonClasses({
                      variant: 'filled',
                      size: 'sm',
                      className: 'relative shrink-0 flex-center gap-2',
                    })}
                  >
                    <Icon name="play_arrow" filled className="w-5 h-5" />
                    Perform
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <NoDataMessage compact>No sets are scheduled for today</NoDataMessage>
      )}
    </section>
  );
}
