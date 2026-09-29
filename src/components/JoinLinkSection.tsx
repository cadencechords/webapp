import { useDispatch } from 'react-redux';
import TeamApi from '../api/TeamApi';
import { setCurrentTeam } from '../store/authSlice';
import { reportError } from '../utils/error';
import ShareLinkCard from './ShareLinkCard';
import type { Team } from '../types';

type JoinLinkSectionProps = {
  team: Team;
};

export default function JoinLinkSection({ team }: JoinLinkSectionProps) {
  const dispatch = useDispatch();

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
    <ShareLinkCard
      title="Join link"
      description={`Anyone with this link can join ${team.name}.`}
      link={`${window.origin}/join/${team.join_link}`}
      enabled={!!team.join_link_enabled}
      onToggle={handleToggleJoinLink}
      className="mt-2"
    />
  );
}
