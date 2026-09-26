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
  bold_chords?: boolean;
  italic_chords?: boolean;
  /** A CSS color. */
  chord_color?: string;
  /** A CSS color. */
  highlight_color?: string;
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
  /** Active sessions, loaded for pro teams when presenting. */
  sessions?: Session[];
}

/** A live session of a setlist, which members follow along with its host. */
export interface Session {
  id: number;
  setlist_id: number;
  /** The host. */
  user_id: number;
  /** The host. */
  user: User;
}

/** One annotation stroke on a song. */
export interface AnnotationPath {
  /** Set once saved. */
  id?: number;
  /** SVG path data, `M x y L x y ...`. */
  path: string;
  color: string;
  stroke_width: number;
}

/** A team member invited to a calendar event. */
export interface EventMembership {
  id: number;
  user: User;
}

export interface CalendarEvent {
  id: number;
  title?: string;
  description?: string;
  color?: string;
  start_time?: string;
  end_time?: string | null;
  reminders_enabled?: boolean;
  reminder_date?: string | null;
  memberships?: EventMembership[];
  setlist_id?: number | null;
  setlist?: Setlist | null;
}

/**
 * The create/edit event form (`EventFormProvider`). `toEventForm` fills it
 * from a saved event, keeping the event's own fields too.
 */
export interface EventForm {
  /** Set when editing a saved event. */
  id?: number;
  title: string;
  description: string;
  color: string;
  /** Who gets reminded. */
  memberships: EventMembership[];
  reminders_enabled?: boolean;
  reminder_date?: string | null;
  remind_number_of_hours_before: number;
  /** `YYYY-MM-DD`. */
  startDate?: string;
  /** `h:mm A`, or empty for an all-day event. */
  startTime?: string;
  /** `h:mm A`, or empty. */
  endTime?: string;
  setlist?: Setlist | null;
}
