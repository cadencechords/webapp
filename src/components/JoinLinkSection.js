import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TeamApi from '../api/TeamApi';
import { setCurrentTeam } from '../store/authSlice';
import { reportError } from '../utils/error';
import DetailTitle from './DetailTitle';

export default function JoinLinkSection({ team }) {
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const dispatch = useDispatch();
  const joinLink = `${window.origin}/join/${team.join_link}`;

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(joinLink);
    setCopyButtonText('Copied!');

    setTimeout(() => setCopyButtonText('Copy'), 3000);
  }

  async function handleToggleJoinLink() {
    try {
      const updates = { join_link_enabled: !team.join_link_enabled };
      dispatch(setCurrentTeam({ ...team, ...updates }));
      await TeamApi.update(updates);
    } catch (error) {
      reportError(error);
    }
  }

  return (
    <div className="mt-2 mb-6">
      <DetailTitle className="mr-0">Join link</DetailTitle>
      <div className="flex items-center flex-wrap text-sm">
        <div className="select-all mr-4">{joinLink}</div>
        <button
          className="text-blue-600 dark:text-dark-blue"
          onClick={handleToggleJoinLink}
        >
          {team.join_link_enabled ? 'Disable' : 'Enable'}
        </button>
        <span className="px-2 text-gray-400 dark:text-dark-gray-400">|</span>
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
