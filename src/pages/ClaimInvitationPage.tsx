import { Link, useHistory, useLocation } from 'react-router-dom';
import { setAuth, setTeamId } from '../store/authSlice';
import { useEffect, useState } from 'react';

import Alert from '../components/Alert';
import Button from '../components/Button';
import CenteredPage from '../components/CenteredPage';
import InvitationApi from '../api/InvitationApi';
import PulseLoader from 'react-spinners/PulseLoader';
import { reportError } from '../utils/error';
import { useDispatch } from 'react-redux';
import type { AxiosResponse } from 'axios';

/** A failed claim, as axios rejects it. A 404 says why in `message`. */
type ClaimError = { response: AxiosResponse<{ message: string }> };

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ClaimInvitationPage() {
  const token = useQuery().get('token');
  const [claimingToken, setClaimingToken] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const dispatch = useDispatch();
  const router = useHistory();

  useEffect(() => {
    async function claimToken() {
      setClaimingToken(true);
      try {
        // Non-null: claimToken is only called when there's a token (below).
        const result = await InvitationApi.claimOne(token!);
        const accessToken = result.headers['access-token'];
        const client = result.headers['client'];
        const uid = result.headers['uid'];
        dispatch(setAuth({ accessToken, client, uid }));
        dispatch(setTeamId(result.data.team_id));
        router.push('/');
      } catch (error) {
        reportError(error);
        // `as` (here and below): the API rejects with an axios error that has
        // the response. An error without one (a network error, or anything
        // else thrown) throws here reading it, as it always has.
        if ((error as ClaimError).response.status === 404) {
          setErrors((error as ClaimError).response.data.message);
          setClaimingToken(false);
        } else if ((error as ClaimError).response.status === 400) {
          router.push(`/invitations/signup?token=${token}`);
        }
      }
    }

    if (token) {
      claimToken();
    }
  }, [token, dispatch, router]);

  if (!token) {
    return (
      <CenteredPage>
        <div className="text-center">
          Uh oh, looks like something went wrong.
          <Link className="mt-3 block" to="/login">
            <Button>Take me home</Button>
          </Link>
        </div>
      </CenteredPage>
    );
  } else if (claimingToken) {
    return (
      <CenteredPage>
        <div className="text-center">
          <div className="mb-4 font-semibold">Claiming your invitation</div>
          <PulseLoader color="#1f6feb" />
        </div>
      </CenteredPage>
    );
  } else if (errors) {
    return (
      <CenteredPage>
        <Alert color="red">{errors}</Alert>
      </CenteredPage>
    );
  }
  return <></>;
}
