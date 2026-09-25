// Models for the API data the app reads, for use from JSDoc in JavaScript
// files, e.g. `useState(/** @type {import('../types').Song | undefined} */ (undefined))`.
//
// Only the fields the typed code reads so far are listed. Add fields as more
// code gets typed.

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  image_url?: string | null;
  position?: string;
  created_at?: string;
}

export interface Team {
  id: number;
  name: string;
  image_url?: string | null;
  created_at?: string;
  users?: User[];
}

export interface Binder {
  id: number;
  name: string;
  color?: string;
}

/** A genre or theme. */
export interface Tag {
  id: number;
  name: string;
}

export interface Track {
  id: number;
}

export interface SongFormat {
  chords_hidden?: boolean;
  font?: string;
  /** A number, or a string such as '14' once edited in the format panel. */
  font_size?: number | string;
}

/** A sticky note on one line of a song. */
export interface SongNote {
  id: number;
  content: string;
  color: string;
  line_number: number;
  /** Position of the note after it's dragged. */
  x?: number;
  y?: number;
}

export interface Song {
  id: number;
  name: string;
  content?: string;
  artist?: string;
  bpm?: number;
  /** 1 (slowest) to 10. */
  scroll_speed?: number;
  meter?: string;
  original_key?: string;
  transposed_key?: string;
  capo?: { capo_key?: string } | null;
  format: SongFormat;
  /** Client-side display flags, not persisted. */
  show_capo?: boolean;
  show_transposed?: boolean;
  genres?: Tag[];
  themes?: Tag[];
  tracks?: Track[];
  notes?: SongNote[];
  binders?: Binder[];
  setlists?: Pick<Setlist, 'id' | 'scheduled_date'>[];
}

export interface Setlist {
  id: number;
  name: string;
  scheduled_date?: string;
  public_link_enabled?: boolean;
  songs?: Song[];
}
