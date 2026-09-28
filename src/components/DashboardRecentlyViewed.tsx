import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import BinderIcon from '../icons/BinderIcon';
import Icon from './Icon';
import SectionTitle from './SectionTitle';
import {
  LIST_ITEM_INTERACTIVE,
  LIST_ITEM_TWO_LINE,
  LIST_SUPPORTING_TEXT,
} from './lists/listItem';
import type {
  RecentlyViewedItem,
  RecentlyViewedType,
} from '../utils/recentlyViewed';

const iconClasses = 'w-6 h-6 shrink-0 text-on-surface-variant';

const TYPES: Record<
  RecentlyViewedType,
  { label: string; path: string; icon: ReactNode }
> = {
  song: {
    label: 'Song',
    path: '/songs',
    icon: <Icon name="music_note" filled className={iconClasses} />,
  },
  set: {
    label: 'Set',
    path: '/sets',
    icon: <Icon name="queue_music" filled className={iconClasses} />,
  },
  folder: {
    label: 'Folder',
    path: '/folders',
    icon: <BinderIcon className={iconClasses} />,
  },
};

// The songs, sets and folders this member opened last, newest first. Shows
// nothing until they've opened one.
export default function DashboardRecentlyViewed({
  items,
}: {
  items: RecentlyViewedItem[];
}) {
  if (items.length === 0) return null;

  return (
    <section>
      <SectionTitle title="Recently viewed" />
      <div className="list-segmented">
        {items.map(item => {
          const { label, path, icon } = TYPES[item.type];
          return (
            <Link
              key={`${item.type}-${item.id}`}
              to={`${path}/${item.id}`}
              className={`${LIST_ITEM_TWO_LINE} ${LIST_ITEM_INTERACTIVE}`}
            >
              {icon}
              <div className="min-w-0">
                <div className="truncate">{item.name}</div>
                <div className={LIST_SUPPORTING_TEXT}>{label}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
