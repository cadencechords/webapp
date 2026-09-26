import { useHistory } from 'react-router';
import Button from './Button';

export default function NoTeamYet() {
  const router = useHistory();

  return (
    <>
      <div className="text-xl font-semibold mb-4">
        Looks like you aren&apos;t a part of any teams yet
      </div>
      <Button
        variant="outlined"
        full
        onClick={() => router.push('/login/teams/new')}
      >
        Make one now
      </Button>
    </>
  );
}
