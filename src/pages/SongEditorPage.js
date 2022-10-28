import { useEffect, useState } from 'react';

import SegmentedControl from '../components/SegmentedControl';
import EditorNavbar from '../components/EditorNavbar';
import EditorFormatOptions from '../components/EditorFormatOptions';
import Editor from '../components/Editor';
import FormattedSong from '../components/FormattedSong';
import useSongEditor from '../hooks/useSongEditor';
import PageLoading from '../components/PageLoading';
import SongEditorProvider from '../contexts/SongEditorProvider';
import PageTitle from '../components/PageTitle';

function Page() {
  const { song, loading, updateContent, dirty, saving, saveChanges } =
    useSongEditor();
  const [selectedTab, setSelectedTab] = useState('Edit content');
  const [showFormatOptions, setShowFormatOptions] = useState(false);

  useEffect(() => {
    document.title = 'Editor';
  });

  if (!song || loading) return <PageLoading />;

  return (
    <>
      <div className="relative">
        <div className="mb-2 md:mb-3">
          <EditorNavbar
            name={song.name}
            dirty={dirty}
            onSave={saveChanges}
            onToggleFormatOptions={() =>
              setShowFormatOptions(previous => !previous)
            }
            saving={saving}
          />
        </div>
        <div className="w-full px-3 flex-center xl:hidden">
          <div className="w-full max-w-md">
            <SegmentedControl
              options={['Edit content', 'Preview']}
              onChange={setSelectedTab}
              selected={selectedTab}
            />
          </div>
        </div>
        <EditorFormatOptions
          show={showFormatOptions}
          onClose={() => setShowFormatOptions(false)}
        />
        {/* Small screen view */}
        <div className="container mx-auto xl:hidden">
          {selectedTab === 'Edit content' && (
            <Editor onContentChange={updateContent} song={song} />
          )}
          {selectedTab === 'Preview' && (
            <div className="p-2 my-3">
              <FormattedSong song={song} />
            </div>
          )}
        </div>

        {/* Large screen view */}
        <div className="hidden xl:flex">
          <div className="flex-1 px-2 border-r dark:border-dark-gray-600">
            <PageTitle title="Edit" />
            <Editor onContentChange={updateContent} song={song} />
          </div>
          <div className="flex-1 mx-2">
            <PageTitle title="Preview" />
            <div className="p-2 my-3">
              <FormattedSong song={song} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SongEditorPage() {
  return (
    <SongEditorProvider>
      <Page />
    </SongEditorProvider>
  );
}
