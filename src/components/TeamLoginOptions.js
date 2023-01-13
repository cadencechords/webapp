import { Link, useHistory } from 'react-router-dom';

import Button from './Button';
import TeamLoginOption from './TeamLoginOption';
import { setTeamId } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';

export default function TeamLoginOptions({ teams }) {
  const router = useHistory();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleLoginTeam = teamId => {
    localStorage.setItem('teamId', teamId);
    dispatch(setTeamId(teamId));
    queryClient.removeQueries();
    router.push('/');
  };

  return (
    <>
      <div className="mb-6 text-xl font-semibold">
        Choose a team to login to
      </div>
      <div>
        {teams.map(team => (
          <TeamLoginOption
            team={team}
            key={team.id}
            onLoginTeam={handleLoginTeam}
          />
        ))}
      </div>
      <div className="flex flex-col mt-6">
        <span className="mb-4">Or create a new team</span>
        <Link to="/login/teams/new">
          <Button variant="outlined" size="md" full>
            Create
          </Button>
        </Link>
      </div>
    </>
  );
}

TeamLoginOptions.defaultProps = {
  teams: [],
};
