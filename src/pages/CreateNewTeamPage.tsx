import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import AuthPage, { TEXT_LINK } from '../components/AuthPage';
import Button from '../components/Button';
import OutlinedInput from '../components/inputs/OutlinedInput';
import TeamApi from '../api/TeamApi';
import TeamPlanOption from '../components/TeamPlanOption';
import { reportError } from '../utils/error';
import { setTeamId } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import useQuery from '../hooks/useQuery';

/** The plan the URL's `requested_plan` asks for, if it's one, else Starter. */
function planToSelect(requestedPlan: string | null) {
  return requestedPlan === 'Starter' || requestedPlan === 'Pro'
    ? requestedPlan
    : 'Starter';
}

export default function CreateNewTeamPage() {
  const [teamName, setTeamIdName] = useState('');
  const requestedPlan = useQuery().get('requested_plan');
  const [selectedPlan, setSelectedPlan] = useState(() =>
    planToSelect(requestedPlan)
  );
  // Select the requested plan again whenever the URL asks for another.
  const [previousRequestedPlan, setPreviousRequestedPlan] =
    useState(requestedPlan);
  if (requestedPlan !== previousRequestedPlan) {
    setPreviousRequestedPlan(requestedPlan);
    setSelectedPlan(planToSelect(requestedPlan));
  }
  const [loading, setLoading] = useState(false);
  const router = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    document.title = 'New Team';
  }, []);

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!teamName) return;
    setLoading(true);

    try {
      const newTeam = { name: teamName, plan: selectedPlan };
      const { data } = await TeamApi.createOne(newTeam);
      dispatch(setTeamId(data.id));
      router.push('/');
    } catch (error) {
      reportError(error);
      setLoading(false);
    }
  };

  return (
    <AuthPage
      title="Create a team"
      description="Name your team and pick a plan to start with."
      footer={
        <Link to="/login/teams" className={TEXT_LINK}>
          Back to your teams
        </Link>
      }
    >
      <form onSubmit={handleCreate} className="flex flex-col gap-4">
        <OutlinedInput
          label="Team name"
          value={teamName}
          onChange={editedTeamName => setTeamIdName(editedTeamName)}
        />
        <div className="mt-2">
          <div
            id="plan-label"
            className="px-1 mb-2 font-plain text-label-large text-on-surface-variant"
          >
            Plan
          </div>
          <div
            role="radiogroup"
            aria-labelledby="plan-label"
            className="flex flex-col gap-3"
          >
            <TeamPlanOption
              name="Starter"
              onClick={setSelectedPlan}
              selected={'Starter' === selectedPlan}
              pricing="$0.00"
              trialMessage="Always free"
            />
            <TeamPlanOption
              name="Pro"
              onClick={setSelectedPlan}
              selected={'Pro' === selectedPlan}
              pricing={
                <>
                  $20.00
                  <span className="text-body-medium"> / month</span>
                </>
              }
              trialMessage="7 day free trial"
            />
          </div>
        </div>
        <Button
          full
          size="md"
          loading={loading}
          disabled={!teamName}
          type="submit"
          className="mt-2"
        >
          Create team
        </Button>
      </form>
    </AuthPage>
  );
}
