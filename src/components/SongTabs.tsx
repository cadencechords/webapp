import SongFilesTab from './SongFilesTab';
import { Tab } from '@headlessui/react';
import { VIEW_FILES } from '../utils/constants';
import { selectCurrentMember } from '../store/authSlice';
import { selectCurrentSubscription } from '../store/subscriptionSlice';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import SongTracksTab from './SongTracksTab';
import { PrimaryTab, PrimaryTabs } from './tabs/PrimaryTabs';
import type { Song, SongFile, Track } from '../types';

type SongTabsProps = {
  song: Song;
  onTrackDeleted: (trackId: number) => void;
  onTracksAdded: (tracks: Track[]) => void;
};

export default function SongTabs({
  song,
  onTrackDeleted,
  onTracksAdded,
}: SongTabsProps) {
  const [files, setFiles] = useState<SongFile[]>();
  // Non-null (both): Content renders the pages only once the membership
  // loads, and SecuredRoutes dispatches the subscription before it.
  const currentSubscription = useSelector(selectCurrentSubscription)!;
  const currentMember = useSelector(selectCurrentMember)!;

  // Both tabs are Pro: without it there's no tab bar (or empty tablist),
  // just the block's spacing, which keeps the page clear of the mobile nav.
  if (!currentSubscription.isPro) {
    return <div className="pt-4 col-span-4 lg:col-span-3 mb-10" />;
  }

  return (
    <Tab.Group as="div" className="pt-4 col-span-4 lg:col-span-3 mb-10">
      <PrimaryTabs>
        {currentMember.can(VIEW_FILES) && <PrimaryTab>Files</PrimaryTab>}
        <PrimaryTab>Tracks</PrimaryTab>
      </PrimaryTabs>
      <Tab.Panels as="div" className="mt-4 outline-hidden focus:outline-hidden">
        {currentMember.can(VIEW_FILES) && (
          <Tab.Panel as="div" className="outline-hidden focus:outline-hidden">
            <SongFilesTab onFilesChange={setFiles} files={files} />
          </Tab.Panel>
        )}
        <Tab.Panel as="div" className="outline-hidden focus:outline-hidden">
          <SongTracksTab
            song={song}
            onDeleted={onTrackDeleted}
            onTracksAdded={onTracksAdded}
          />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
