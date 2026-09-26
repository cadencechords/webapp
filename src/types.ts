// Models for the API data the app reads. The `src/api` helpers return them
// (`AxiosResponse<Song>` and so on). JavaScript files can use them from JSDoc,
// e.g. `useState(/** @type {import('../types').Song | undefined} */ (undefined))`.
//
// Only the fields the code reads are listed. Add fields as more code gets
// typed.

import type { ButtonColor } from './components/Button';

/** An id: a number from the API, or a string from a route param or input. */
export type Id = number | string;

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  image_url?: string | null;
  /** The user's position on the current team (`UserApi.getMember`). */
  position?: string;
  created_at?: string;
  /** An IANA time zone, saved from the browser on sign-in. */
  timezone?: string | null;
  /** Whether the user has connected Planning Center. */
  pco_connected?: boolean;
  format_preferences?: FormatPreferences;
  /** The user's role on the current team, set by `setMembership`. */
  role?: Role;
  /** Signs the user in to Stream Chat (ChatPage). */
  chat_token?: string;
  /** devise_token_auth's id for the user; OneSignal's external user id. */
  uid?: string;
}

/** The current user's display preferences. */
export interface FormatPreferences {
  hide_chords?: boolean;
}

export interface Team {
  id: number;
  name: string;
  image_url?: string | null;
  created_at?: string;
  users?: User[];
  /** The code at the end of the team's join link, `/join/<code>`. */
  join_link?: string;
  join_link_enabled?: boolean;
  default_format?: FormatPreset;
}

/** `TeamApi.getCurrentTeam`. */
export interface CurrentTeamResponse {
  team: Team;
  subscription: Subscription;
  /** The team's members, each with their `position` on the team. */
  members: User[];
}

/** A user's membership of a team. */
export interface Membership {
  id: number;
  user: User;
  role: Role;
  position?: string;
}

/** A permission a role can have, e.g. `'Edit songs'`. */
export interface Permission {
  id?: number;
  name: string;
  description?: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  is_admin?: boolean;
  is_member?: boolean;
  permissions?: Permission[];
  memberships?: Membership[];
}

/** The team's subscription. */
export interface Subscription {
  plan_name?: string;
  status?: string;
  is_pro?: boolean;
  /** Set from `is_pro` by the subscription slice. */
  isPro?: boolean;
  price?: number;
  expires_at?: string | null;
  /** Where it was bought, e.g. the App Store. */
  store?: string;
}

export interface Invitation {
  id: number;
  email: string;
  created_at?: string;
}

/** The response to signing up or claiming an invitation. */
export interface InvitationClaim {
  team_id: number;
}

/** A team another team can import songs from (`ImportsApi`). */
export interface ImportableTeam {
  id: number;
  name: string;
  image_url?: string | null;
}

/** A song on a Planning Center account. */
export interface PcoSong {
  id: number | string;
  title?: string;
  author?: string;
}

/** An OnSong backup, unzipped by the API for import. */
export interface OnsongBackup {
  id: number;
  files: OnsongFile[];
}

export interface OnsongFile {
  name: string;
}

export interface NotificationSetting {
  id: number;
  notification_type: string;
  email_enabled?: boolean;
  sms_enabled?: boolean;
  push_enabled?: boolean;
}

export interface Binder {
  id: number;
  name: string;
  description?: string;
  color?: string;
  songs?: Song[];
}

/** A saved song format a team can make its default. */
export interface FormatPreset {
  id: number;
  name?: string;
}

/** A file attached to a song. */
export interface SongFile {
  id: number;
  name: string;
  url: string;
  /** In bytes. */
  size: number;
}

/** A marking (a shape or a text label) placed on a song. */
export interface Marking {
  id: number;
  marking_type: string;
  content?: string;
  x?: number;
  y?: number;
  scale?: number;
  rotation?: number;
}

/** A capo saved on a song. */
export interface Capo {
  id: number;
  capo_key: string;
}

/** A genre or theme. */
export interface Tag {
  id: number;
  name: string;
}

export interface Track {
  id: number;
  name?: string;
  /** `'Apple Music'`, `'Spotify'` or `'YouTube'`. */
  source?: string;
  url?: string;
  artwork_url?: string;
  external_id?: string;
}

export interface SongFormat {
  chords_hidden?: boolean;
  /** Fit the lyrics to the screen width. */
  autosize?: boolean;
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
  /**
   * No `id` until a capo picked in the capo sheet is saved, and a null
   * `capo_key` when "no capo" is picked there.
   */
  capo?: { id?: number; capo_key: string | null } | null;
  format: SongFormat;
  /** Client-side display flags, not persisted. */
  show_capo?: boolean;
  show_transposed?: boolean;
  show_roadmap?: boolean;
  genres?: Tag[];
  themes?: Tag[];
  tracks?: Track[];
  notes?: SongNote[];
  /** Section names in play order, e.g. `['Verse', 'Chorus']`. */
  roadmap?: string[];
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
  /** One of the colors EventColorOptions offers. */
  color?: ButtonColor;
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
  /**
   * One of the colors EventColorOptions offers. Optional because
   * EventColorOption hands its color on as optional.
   */
  color?: ButtonColor;
  /** Who gets reminded. */
  memberships: EventMembership[];
  reminders_enabled?: boolean;
  reminder_date?: string | null;
  remind_number_of_hours_before: number;
  /** `YYYY-MM-DD`. */
  startDate?: string;
  /** `h:mm A`, or empty for an all-day event; null once TimeInput is cleared. */
  startTime?: string | null;
  /** `h:mm A`, or empty; null once TimeInput is cleared. */
  endTime?: string | null;
  setlist?: Setlist | null;
}
