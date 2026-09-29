import { useEffect, useState } from 'react';

import CenteredPage from '../components/CenteredPage';
import NoTeamYet from '../components/NoTeamYet';
import TeamApi from '../api/TeamApi';
import TeamLoginOptions from '../components/TeamLoginOptions';
import { reportError } from '../utils/error';
import type { Team } from '../types';
import LoadingIndicator from '../components/feedback/LoadingIndicator';

export default function TeamLoginPage() {
  const [teams, setTeamIds] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Login | Teams';

    async function fetchTeams() {
      try {
        const result = await TeamApi.getAll();
        setTeamIds(result.data);
      } catch (error) {
        reportError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  return (
    <CenteredPage>
      {loading && (
        <div className="flex justify-center">
          <LoadingIndicator />
        </div>
      )}
      {!loading && teams.length === 0 && (
        <div className="text-center">
          <NoTeamYet />
        </div>
      )}
      {!loading && teams.length > 0 && <TeamLoginOptions teams={teams} />}
    </CenteredPage>
  );
}
