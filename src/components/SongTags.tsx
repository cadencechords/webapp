import type { ReactNode } from 'react';
import BinderColor from './BinderColor';
import DetailTag from './DetailTag';
import Icon from './Icon';
import type { Binder, Tag } from '../types';

type SongTagsProps = {
  binders?: Binder[];
  genres?: Tag[];
  themes?: Tag[];
  canEdit?: boolean;
  onAddGenre: () => void;
  onAddTheme: () => void;
  onRemoveGenre: (id: number) => void;
  onRemoveTheme: (id: number) => void;
};

// A song's Tags tab: its folders, genres and themes, each under its heading.
// Folders are links (added from the folder); genres and themes can be removed
// and added here when editing.
export default function SongTags({
  binders = [],
  genres = [],
  themes = [],
  canEdit = false,
  onAddGenre,
  onAddTheme,
  onRemoveGenre,
  onRemoveTheme,
}: SongTagsProps) {
  const removable = (
    items: Tag[],
    kind: string,
    onRemove: (id: number) => void
  ) =>
    items.map(item => (
      <DetailTag
        key={item.id}
        onRemove={canEdit ? () => onRemove(item.id) : undefined}
        removeLabel={`Remove ${kind} ${item.name}`}
      >
        {item.name}
      </DetailTag>
    ));

  return (
    <div className="flex flex-col gap-6">
      <TagSection title="Folders" empty={binders.length === 0}>
        {binders.map(binder => (
          <DetailTag
            key={binder.id}
            to={`/folders/${binder.id}`}
            leading={<BinderColor color={binder.color} size={3} />}
          >
            {binder.name}
          </DetailTag>
        ))}
      </TagSection>
      <TagSection
        title="Genres"
        empty={genres.length === 0}
        onAdd={canEdit ? onAddGenre : undefined}
      >
        {removable(genres, 'genre', onRemoveGenre)}
      </TagSection>
      <TagSection
        title="Themes"
        empty={themes.length === 0}
        onAdd={canEdit ? onAddTheme : undefined}
      >
        {removable(themes, 'theme', onRemoveTheme)}
      </TagSection>
    </div>
  );
}

// A heading over its chips; the add icon button ends the chips, where the new
// one will appear.
function TagSection({
  title,
  empty,
  onAdd,
  children,
}: {
  title: string;
  empty: boolean;
  onAdd?: () => void;
  children: ReactNode;
}) {
  return (
    <section aria-label={title} className="flex flex-col gap-2 font-plain">
      <h3 className="text-title-small text-on-surface">{title}</h3>
      {empty && !onAdd ? (
        <p className="text-body-medium text-on-surface-variant">
          No {title.toLowerCase()}
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {children}
          {onAdd && (
            <button
              type="button"
              onClick={onAdd}
              aria-label={`Add ${title.toLowerCase()}`}
              className="flex-center w-7 h-7 rounded-full text-on-surface-variant state-layer focus-ring"
            >
              <Icon name="add" className="w-[18px] h-[18px]" />
            </button>
          )}
        </div>
      )}
    </section>
  );
}
