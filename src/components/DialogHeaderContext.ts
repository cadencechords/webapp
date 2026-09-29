import { createContext } from 'react';

/** Where a full-screen dialog (below sm) keeps its primary action: a slot in
    its header. `mobile` is false for any other dialog, whose actions stay at
    the bottom; `slot` is null until the header mounts. */
export type DialogHeader = { mobile: boolean; slot: HTMLElement | null };

export const DialogHeaderContext = createContext<DialogHeader>({
  mobile: false,
  slot: null,
});
