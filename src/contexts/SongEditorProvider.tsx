import React, { createContext, useContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { Song, SongFormat } from '../types';

export interface SongEditorContextValue {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  saving: boolean;
  setSaving: Dispatch<SetStateAction<boolean>>;
  /** Undefined until the song is loaded. */
  song: Song | undefined;
  setSong: Dispatch<SetStateAction<Song | undefined>>;
  /** Unsaved content; `null` or `undefined` when there is none. */
  editedContent: string | null | undefined;
  setEditedContent: Dispatch<SetStateAction<string | null | undefined>>;
  /** Unsaved format changes; `null` or `undefined` when there are none. */
  editedFormat: Partial<SongFormat> | null | undefined;
  setEditedFormat: Dispatch<
    SetStateAction<Partial<SongFormat> | null | undefined>
  >;
}

export const SongEditorContext = createContext<
  SongEditorContextValue | undefined
>(undefined);

/** The song editor context. Throws outside a `SongEditorProvider`. */
export function useSongEditorContext(): SongEditorContextValue {
  const value = useContext(SongEditorContext);
  if (value === undefined) {
    throw new Error(
      'useSongEditorContext must be used inside a SongEditorProvider'
    );
  }
  return value;
}

export default function SongEditorProvider(props: { children?: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [song, setSong] = useState<Song | undefined>();
  const [editedContent, setEditedContent] = useState<
    string | null | undefined
  >();
  const [editedFormat, setEditedFormat] = useState<
    Partial<SongFormat> | null | undefined
  >();

  return (
    <SongEditorContext.Provider
      {...props}
      value={{
        loading,
        setLoading,
        song,
        setSong,
        editedContent,
        setEditedContent,
        editedFormat,
        setEditedFormat,
        saving,
        setSaving,
      }}
    />
  );
}
