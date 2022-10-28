import React, { createContext, useState } from 'react';

export const SongEditorContext = createContext();

export default function SongEditorProvider(props) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [song, setSong] = useState();
  const [editedContent, setEditedContent] = useState();
  const [editedFormat, setEditedFormat] = useState();

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
