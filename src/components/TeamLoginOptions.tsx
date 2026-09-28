import { Link, useHistory } from 'react-router-dom';

import Icon from './Icon';
import type { Team } from '../types';
import TeamLoginOption, { TEAM_ROW } from './TeamLoginOption';
import { setTeamId } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { LIST_ITEM_INTERACTIVE, LIST_SUPPORTING_TEXT } from './lists/listItem';

type TeamLoginOptionsProps = {
  teams?: Team[];
};

export default function TeamLoginOptions({
  teams = [],
}: TeamLoginOptionsProps) {
  const router = useHistory();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleLoginTeam = (teamId: number) => {
    localStorage.setItem('teamId', String(teamId));
    dispatch(setTeamId(teamId));
    queryClient.removeQueries();
    router.push('/');
  };

  return (
    <div className="font-plain">
      <h1 className="mb-6 text-center text-headline-small text-on-surface">
        Choose a team to login to
      </h1>
      {/* M3 segmented lists, like the account page. */}
      <div className="list-segmented">
        {teams.map(team => (
          <TeamLoginOption
            team={team}
            key={team.id}
            onLoginTeam={handleLoginTeam}
          />
        ))}
      </div>
      <div className="mt-6 list-segmented">
        <Link
          to="/login/teams/new"
          className={`${TEAM_ROW} ${LIST_ITEM_INTERACTIVE} min-h-[80px]`}
        >
          <span className="flex-center w-10 h-10 shrink-0 rounded-[12px] bg-secondary-container text-on-secondary-container">
            <Icon name="add" className="w-6 h-6" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-title-medium">Create a new team</div>
            <div className={LIST_SUPPORTING_TEXT}>
              Start one and invite your members
            </div>
          </div>
          <Icon
            name="chevron_right"
            className="w-6 h-6 shrink-0 text-on-surface-variant"
          />
        </Link>
      </div>
    </div>
  );
}
