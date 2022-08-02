import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SetlistApi from '../api/SetlistApi';
import { selectCurrentMember } from '../store/authSlice';
import { PUBLISH_SETLISTS } from '../utils/constants';
import { reportError } from '../utils/error';
import SectionTitle from './SectionTitle';

const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;

export default function PublicSetlistSection({ setlist, onChange }) {
  const currentMember = useSelector(selectCurrentMember);
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const publicLink = `${PUBLIC_URL}/setlists/${setlist.public_link}`;

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(publicLink);
    setCopyButtonText('Copied!');

    setTimeout(() => setCopyButtonText('Copy'), 3000);
  }

  async function handleTogglePublicLink() {
    try {
      const updates = { publicLinkEnabled: !setlist.public_link_enabled };
      onChange(updates.publicLinkEnabled);
      await SetlistApi.updateOne(updates, setlist.id);
    } catch (error) {
      reportError(error);
    }
  }

  return (
    <div className="mt-10 md:mt-4 mb-16 md:mb-8">
      <SectionTitle title="Public Link" />
      <div className="flex items-center flex-wrap text-sm">
        <div className="select-all mr-4">{publicLink}</div>
        {currentMember.can(PUBLISH_SETLISTS) && (
          <>
            <button
              className="text-blue-600 dark:text-dark-blue"
              onClick={handleTogglePublicLink}
            >
              {setlist.public_link_enabled ? 'Disable' : 'Enable'}
            </button>
            <span className="px-2 text-gray-400 dark:text-dark-gray-400">
              |
            </span>
          </>
        )}
        <button
          className={
            copyButtonText === 'Copy'
              ? 'text-blue-600 dark:text-dark-blue'
              : 'text-gray-300 dark:text-dark-gray-400'
          }
          onClick={handleCopyToClipboard}
          disabled={copyButtonText === 'Copied!'}
        >
          {copyButtonText}
        </button>
      </div>
    </div>
  );
}
