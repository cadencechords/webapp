import { Link, useHistory, useLocation } from 'react-router-dom';
import { setAuth, setTeamId } from '../store/authSlice';
import { useEffect, useState } from 'react';

import AuthPage, { TEXT_LINK } from '../components/AuthPage';
import InvitationApi from '../api/InvitationApi';
import { reportError } from '../utils/error';
import { useDispatch } from 'react-redux';
import type { AxiosResponse } from 'axios';
import LoadingIndicator from '../components/feedback/LoadingIndicator';

/** A failed claim, as axios rejects it. A 404 says why in `message`. */
type ClaimError = { response: AxiosResponse<{ message: string }> };

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ClaimInvitationPage() {
  const token = useQuery().get('token');
  // Claiming starts as soon as there's a token, so nothing blank shows first.
  const [claimingToken, setClaimingToken] = useState(!!token);
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

  const signInFooter = (
    <>
      Already have an account?
      <Link to="/login" className={TEXT_LINK}>
        Sign in
      </Link>
    </>
  );

  if (!token) {
    return (
      <AuthPage
        title="This invitation doesn't work"
        description="Invalid invitation link. Ask whoever invited you to send a new one."
        footer={signInFooter}
      />
    );
  } else if (errors) {
    return (
      <AuthPage
        title="This invitation doesn't work"
        // The API's message may end with a period; don't double it.
        description={`${errors.replace(/\.$/, '')}. Ask whoever invited you to send a new one.`}
        footer={signInFooter}
      />
    );
  } else if (claimingToken) {
    return (
      <AuthPage
        title="Joining your team"
        description="Hang tight while we accept your invitation."
      >
        <div className="flex justify-center">
          <LoadingIndicator />
        </div>
      </AuthPage>
    );
  }
  return <></>;
}
