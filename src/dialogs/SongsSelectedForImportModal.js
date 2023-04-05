import React from 'react';
import Modal from '../components/Modal';
import Checkbox from '../components/Checkbox';
import { pluralize } from '../utils/StringUtils';

export default function SongsSelectedForImportModal({
  open,
  onClose,
  selectedSongs,
  onRemoveSong,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      dialogSize="2xl"
      title="Selected songs"
    >
      <div className="mb-4">
        {selectedSongs.length} {pluralize('song', selectedSongs.length)}{' '}
        selected
      </div>
      <div className="pb-4 sm:pb-0 sm:max-h-96 sm:overflow-y-auto">
        {selectedSongs.map(song => (
          <label
            key={song.id}
            className="flex items-center h-12 gap-4 px-3 border-b sm:rounded-lg sm:hover:bg-gray-100 sm:dark:hover:bg-dark-gray-800 dark:border-dark-gray-600 last:border-0 sm:border-0"
          >
            <Checkbox
              checked={true}
              onChange={() => onRemoveSong(song)}
              standAlone={false}
            />
            <span className="inline-block overflow-hidden whitespace-nowrap overflow-ellipsis">
              {song.title}
            </span>
          </label>
        ))}
      </div>
    </Modal>
  );
}
