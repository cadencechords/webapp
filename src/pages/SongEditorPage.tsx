import { useEffect, useState, type ReactNode } from 'react';

import SegmentedControl from '../components/SegmentedControl';
import EditorNavbar from '../components/EditorNavbar';
import EditorFormatOptions from '../components/EditorFormatOptions';
import Editor from '../components/Editor';
import FormattedSong from '../components/FormattedSong';
import useSongEditor from '../hooks/useSongEditor';
import PageLoading from '../components/PageLoading';
import SongEditorProvider from '../contexts/SongEditorProvider';

function Page() {
  const { song, loading, updateContent, dirty, saving, saveChanges } =
    useSongEditor();
  const [selectedTab, setSelectedTab] = useState('Edit content');
  const [showFormatOptions, setShowFormatOptions] = useState(false);

  useEffect(() => {
    document.title = 'Editor';
  });

  if (!song || loading) return <PageLoading />;

  const editor = (
    <Pane label="Edit">
      <Editor onContentChange={updateContent} song={song} />
    </Pane>
  );
  const preview = (
    <Pane label="Preview">
      <div className="p-2">
        <FormattedSong song={song} />
      </div>
    </Pane>
  );

  // M3E: a top app bar, then the editor and the preview on cards: side by
  // side from xl, and behind a segmented control below it.
  return (
    <div className="min-h-screen bg-surface">
      <EditorNavbar
        name={song.name}
        dirty={dirty}
        onSave={saveChanges}
        onToggleFormatOptions={() =>
          setShowFormatOptions(previous => !previous)
        }
        saving={saving}
        isFormatOpen={showFormatOptions}
      />
      <EditorFormatOptions
        show={showFormatOptions}
        onClose={() => setShowFormatOptions(false)}
      />
      <main className="px-3 pb-8 mx-auto max-w-7xl sm:px-4">
        {/* Small screens: one pane at a time. */}
        <div className="xl:hidden">
          <div className="max-w-md mx-auto mb-4">
            <SegmentedControl
              options={['Edit content', 'Preview']}
              onChange={setSelectedTab}
              selected={selectedTab}
            />
          </div>
          {selectedTab === 'Edit content' ? editor : preview}
        </div>

        {/* Large screens: both panes. */}
        <div className="hidden gap-4 xl:grid xl:grid-cols-2">
          {editor}
          {preview}
        </div>
      </main>
    </div>
  );
}

/** A pane of the editor: a label over a card. */
function Pane({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="min-w-0">
      <h2 className="hidden px-2 mb-2 xl:block text-title-small text-on-surface-variant font-plain">
        {label}
      </h2>
      <div className="p-2 rounded-extra-large bg-surface-container-low text-on-surface">
        {children}
      </div>
    </section>
  );
}

export default function SongEditorPage() {
  return (
    <SongEditorProvider>
      <Page />
    </SongEditorProvider>
  );
}
