import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import Alert from '../components/Alert';
import AuthPage, { FILLED_LINK, TEXT_LINK } from '../components/AuthPage';
import Button from '../components/Button';
import LoadingIndicator from '../components/feedback/LoadingIndicator';
import ProfilePicture from '../components/ProfilePicture';
import useAuth from '../hooks/useAuth';
import useJoinLink from '../hooks/useJoinLink';
import { setTeamId } from '../store/authSlice';
import { getNameOrEmail, hasName } from '../utils/model';

export default function JoinLinkPage() {
  const { code } = useParams<{ code: string }>();
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

  useEffect(() => {
    document.title = 'Join team';
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
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

  // Non-null (in both handlers): their buttons show only once the link has
  // resolved to the team.
  function handleGoToTeam() {
    localStorage.setItem('teamId', String(team!.id));
    dispatch(setTeamId(team!.id));
  }

  async function handleJoinTeam() {
    await join();
    localStorage.setItem('teamId', String(team!.id));
    dispatch(setTeamId(team!.id));
    router.push('/');
  }

  const signInAgainUrl = `/login?target_url=${window.location.pathname}`;
  const otherUserFooter = (
    <>
      Not you?
      <Link to={signInAgainUrl} className={TEXT_LINK}>
        Sign in as someone else
      </Link>
    </>
  );

  if (errored) {
    return (
      <AuthPage
        title="We couldn't find that team"
        description="We were unable to find a team with this link. Ask your team for a new one."
      />
    );
  }

  if (isAnythingLoading) {
    return (
      <AuthPage
        title="Checking your link"
        description="Just a moment while we find your team."
      >
        <div className="flex justify-center">
          <LoadingIndicator />
        </div>
      </AuthPage>
    );
  }

  if (isEverythingResolved && !currentUser) {
    return (
      <AuthPage
        title="Sign in to join"
        description="You need to be signed in to join this team. Taking you to the sign-in page…"
      >
        <Link to={signInAgainUrl} className={FILLED_LINK}>
          Sign in now
        </Link>
      </AuthPage>
    );
  }

  if (isEverythingResolved && currentUser && isAlreadyOnTeam()) {
    return (
      <AuthPage
        title={`You're already on ${team?.name}`}
        description="No need to join again. Pick up where you left off."
        footer={otherUserFooter}
      >
        <Link to="/" onClick={handleGoToTeam} className={FILLED_LINK}>
          Go to team
        </Link>
      </AuthPage>
    );
  }

  // Non-null (currentUser! below): past the returns above, the link and the
  // user have loaded, and a signed-out user got the sign-in page instead.
  return (
    <AuthPage
      title={`Join ${team?.name}`}
      description="You'll join the team with this account."
      footer={otherUserFooter}
    >
      <div className="flex flex-col gap-6">
        {/* The account that's joining, as a list segment. */}
        <div className="flex items-center gap-4 px-5 py-4 rounded-extra-large bg-surface-container font-plain">
          <ProfilePicture
            url={currentUser!.image_url}
            name={getNameOrEmail(currentUser!)}
            size="md"
          />
          <div className="flex-1 min-w-0">
            {hasName(currentUser) && (
              <div className="truncate text-title-medium text-on-surface">
                {currentUser!.first_name} {currentUser!.last_name}
              </div>
            )}
            <div className="truncate text-body-medium text-on-surface-variant">
              {currentUser!.email}
            </div>
          </div>
        </div>

        {errored && error && <Alert color="yellow">{error}</Alert>}

        <Button
          full
          size="md"
          name="join"
          onClick={handleJoinTeam}
          loading={joinLoading}
        >
          Join team
        </Button>
      </div>
    </AuthPage>
  );
}
