import { useState } from 'react';

import Button from '../components/Button';
import CenteredPage from '../components/CenteredPage';
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

  const handleCreate = async () => {
    setLoading(!loading);

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
    <CenteredPage>
      <div className="mb-6 text-xl font-bold text-center">Your New Team</div>
      <TeamPlanOption
        name="Starter"
        onClick={setSelectedPlan}
        selected={'Starter' === selectedPlan}
        className="mb-2"
        pricing="$0.00"
        trialMessage="Always free"
      />
      <TeamPlanOption
        name="Pro"
        onClick={setSelectedPlan}
        selected={'Pro' === selectedPlan}
        className="mb-8"
        pricing={
          <div>
            $20.00<span className="text-sm"> / month</span>
          </div>
        }
        trialMessage="7 Day Free Trial"
      />
      <div className="mb-1 font-semibold text-left">Your team&apos;s name</div>
      <OutlinedInput
        placeholder="Name"
        value={teamName}
        onChange={editedTeamName => setTeamIdName(editedTeamName)}
      />

      <div className="mt-6">
        <Button
          full
          loading={loading}
          onClick={handleCreate}
          disabled={!teamName}
        >
          Create
        </Button>
      </div>
    </CenteredPage>
  );
}
