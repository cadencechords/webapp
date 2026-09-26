import React, { useState } from 'react';
import TracksApi from '../api/tracksApi';
import AppleMusicSearchResults from '../components/AppleMusicSearchResults';
import AddCancelActions from '../components/buttons/AddCancelActions';
import WellInput from '../components/inputs/WellInput';
import SpotifySearchResults from '../components/SpotifySearchResults';
import StyledDialog from '../components/StyledDialog';
import TrackSourceButton from '../components/TrackSourceButton';
import YouTubeSearchResults from '../components/YouTubeSearchResults';
import AppleMusicIcon from '../images/apple_music_icon.png';
import SpotifyIcon from '../images/spotify_icon.png';
import YouTubeIcon from '../images/youtube_icon.png';
import { reportError } from '../utils/error';
import { pluralize } from '../utils/StringUtils';
import type { NewTrack, Song, Track } from '../types';

type AddTracksDialogProps = {
  open: boolean;
  onCloseDialog: () => void;
  song: Song;
  onTracksAdded: (tracks: Track[]) => void;
};

export default function AddTracksDialog({
  open,
  onCloseDialog,
  song,
  onTracksAdded,
}: AddTracksDialogProps) {
  const [selectedSource, setSelectedSource] = useState('Spotify');
  const [query, setQuery] = useState(song?.name || '');
  const [selectedTracks, setSelectedTracks] = useState<NewTrack[]>([]);
  const [saving, setSaving] = useState(false);

  function getSearchResultsComponent() {
    if (selectedSource === 'Spotify') {
      return (
        <SpotifySearchResults
          query={query}
          onTrackClick={handleTrackClick}
          selectedTracks={selectedTracks}
        />
      );
    } else if (selectedSource === 'Apple Music') {
      return (
        <AppleMusicSearchResults
          query={query}
          onTrackClick={handleTrackClick}
          selectedTracks={selectedTracks}
        />
      );
    } else if (selectedSource === 'YouTube') {
      return (
        <YouTubeSearchResults
          query={query}
          onTrackClick={handleTrackClick}
          selectedTracks={selectedTracks}
        />
      );
    }
  }

  function handleTrackClick(track: NewTrack, checked: boolean) {
    setSelectedTracks(currentTracks => {
      if (checked) {
        return currentTracks.concat([track]);
      } else {
        return currentTracks.filter(
          selectedTrack => selectedTrack.external_id !== track.external_id
        );
      }
    });
  }

  function handleCancel() {
    setSelectedSource('Spotify');
    setSelectedTracks([]);
    onCloseDialog();
  }

  async function handleSave() {
    try {
      setSaving(true);
      const { data } = await TracksApi.createBulk(selectedTracks, song.id);
      onTracksAdded(data);
      setSaving(false);
      onCloseDialog();
      setSelectedTracks([]);
      setSelectedSource('Spotify');
    } catch (error) {
      reportError(error);
      setSaving(false);
    }
  }

  return (
    <StyledDialog
      borderedTop={false}
      open={open}
      size="3xl"
      onCloseDialog={onCloseDialog}
      title="Add tracks"
    >
      <div className="flex items-center mb-4">
        <TrackSourceButton
          source="Spotify"
          icon={SpotifyIcon}
          selected={selectedSource === 'Spotify'}
          onClick={setSelectedSource}
        />
        <TrackSourceButton
          source="Apple Music"
          icon={AppleMusicIcon}
          selected={selectedSource === 'Apple Music'}
          onClick={setSelectedSource}
        />
        <TrackSourceButton
          source="YouTube"
          icon={YouTubeIcon}
          selected={selectedSource === 'YouTube'}
          onClick={setSelectedSource}
        />
      </div>
      <WellInput
        onChange={setQuery}
        value={query}
        placeholder="Search for a song"
      />

      <div className="max-h-80 h-80 overflow-y-auto my-4">
        {getSearchResultsComponent()}
      </div>
      <div className="pt-4">
        <AddCancelActions
          addDisabled={selectedTracks?.length === 0}
          addText={`Add ${selectedTracks.length} ${pluralize(
            'track',
            selectedTracks.length
          )}`}
          onCancel={handleCancel}
          loadingAdd={saving}
          onAdd={handleSave}
        />
      </div>
    </StyledDialog>
  );
}
