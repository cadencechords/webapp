// Classes for an M3 list item in a list-segmented container
// (src/styles/lists.css).

/** A one-line item: 56dp, 16dp side padding, 16dp between its parts. */
export const LIST_ITEM =
  'flex items-center gap-4 min-h-14 px-4 py-2 font-plain text-body-large text-on-surface';

/** A two-line item (a headline and supporting text): 72dp. */
export const LIST_ITEM_TWO_LINE = `${LIST_ITEM} min-h-[72px]`;

/** A clickable item: a state layer that fades, corners that morph while
    pressed (list-item-motion), and an inset focus ring. */
export const LIST_ITEM_INTERACTIVE =
  'state-layer-flat list-item-motion outline-none focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-secondary focus-visible:-outline-offset-3';

/** Supporting text under an item's headline. */
export const LIST_SUPPORTING_TEXT = 'text-body-medium text-on-surface-variant';

/** Lighter hover (4%) and pressed (6%) layers for something on
    surface-container-lowest in a dialog: the standard 8% and 10% would darken
    it to about the dialog's own surface. */
export const ON_LOWEST_STATE_LAYERS =
  '[--md-sys-state-hover-state-layer-opacity:0.04] [--md-sys-state-pressed-state-layer-opacity:0.06]';
