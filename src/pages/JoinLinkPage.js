import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Card from '../components/Card';
import CenteredPage from '../components/CenteredPage';
import OrDivider from '../components/OrDivider';
import PageLoading from '../components/PageLoading';
import ProfilePicture from '../components/ProfilePicture';
import useAuth from '../hooks/useAuth';
import useJoinLink from '../hooks/useJoinLink';
import { setTeamId } from '../store/authSlice';
import { hasName } from '../utils/model';

export default function JoinLinkPage() {
  const { code } = useParams();
  const {
    loading: verifyingLink,
    errored,
    data: team,
    idle,
    resolved,
    join,
    joinLoading,
    error,
  } = useJoinLink(code);
  const {
    currentUser,
    loading: verifyingCredentials,
    hasCredentials,
    refreshCurrentUser,
  } = useAuth();
  const isAnythingLoading = verifyingLink || idle || verifyingCredentials;
  const isEverythingResolved = resolved && !idle && !verifyingCredentials;
  const router = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (hasCredentials && !currentUser) {
      refreshCurrentUser();
    }
  }, [hasCredentials, refreshCurrentUser, currentUser]);

  useEffect(() => (document.title = 'Join team'), []);

  useEffect(() => {
    let timeout;
    if (isEverythingResolved && !currentUser) {
      timeout = setTimeout(() => {
        router.push(`/login?target_url=${window.location.pathname}`);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isEverythingResolved, currentUser, router]);

  function isAlreadyOnTeam() {
    return !!team?.users?.find(user => user.id === currentUser?.id);
  }

  function handleGoToTeam() {
    localStorage.setItem('teamId', team.id);
    dispatch(setTeamId(team.id));
  }

  function handleJoinTeam() {
    join();
    localStorage.setItem('teamId', team.id);
    dispatch(setTeamId(team.id));
    router.push('/');
  }

  if (errored) {
    return (
      <CenteredPage>
        <Alert color="red">We were unable to find a team with this link.</Alert>
      </CenteredPage>
    );
  }

  if (isAnythingLoading) {
    return (
      <CenteredPage>
        <PageLoading />
      </CenteredPage>
    );
  }

  if (isEverythingResolved && !currentUser) {
    return (
      <CenteredPage>
        <Alert color="yellow">
          You need to be logged in first to join this team. Taking you to the
          login page.
        </Alert>
      </CenteredPage>
    );
  }

  if (isEverythingResolved && currentUser && isAlreadyOnTeam()) {
    return (
      <CenteredPage>
        <h1 className="mb-8 text-xl text-center">
          You're already on <span className="font-bold">{team?.name}</span>
        </h1>
        <Link to="/">
          <Button full={true} onClick={handleGoToTeam} name="go to team">
            Go to team
          </Button>
        </Link>
        <OrDivider />
        <Link to={`/login?target_url=${window.location.pathname}`}>
          <Button variant="open" full={true} name="use other user">
            Login as someone else
          </Button>
        </Link>
      </CenteredPage>
    );
  }

  return (
    <CenteredPage>
      <>
        <h1 className="mb-8 text-2xl text-center">
          You are now joining <span className="font-bold">{team?.name}</span>
        </h1>
        <div>
          <Card className="flex flex-col items-center text-center">
            <ProfilePicture url={currentUser.image_url} />
            {hasName(currentUser) && (
              <div className="mb-1 text-xl font-semibold">
                {currentUser.first_name} {currentUser.last_name}
              </div>
            )}
            <span className="mb-4">{currentUser.email}</span>

            {errored && error && <Alert color="yellow">{error}</Alert>}

            <Button
              full={true}
              name="join"
              onClick={handleJoinTeam}
              loading={joinLoading}
            >
              Join team
            </Button>
          </Card>
          <OrDivider />
          <Link to={`/login?target_url=${window.location.pathname}`}>
            <Button variant="open" full name="use other user">
              Login as someone else
            </Button>
          </Link>
        </div>
      </>
    </CenteredPage>
  );
}
