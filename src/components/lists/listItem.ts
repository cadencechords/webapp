// Classes for an M3 list item in a list-segmented container
// (src/styles/lists.css).

/** A one-line item: 56dp, 16dp side padding, 16dp between its parts. */
export const LIST_ITEM =
  'flex items-center gap-4 min-h-14 px-4 py-2 font-plain text-body-large text-on-surface';

/** A two-line item (a headline and supporting text): 72dp. */
export const LIST_ITEM_TWO_LINE = `${LIST_ITEM} min-h-[72px]`;

/** A clickable item: a state layer and an inset focus ring. */
export const LIST_ITEM_INTERACTIVE =
  'state-layer-flat outline-none focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-secondary focus-visible:-outline-offset-3';

/** Supporting text under an item's headline. */
export const LIST_SUPPORTING_TEXT = 'text-body-medium text-on-surface-variant';
