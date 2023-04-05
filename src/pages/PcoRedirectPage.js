import PlanningCenterApi from '../api/PlanningCenterApi';
import { reportError } from '../utils/error';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import useQuery from '../hooks/useQuery';

export default function PcoRedirectPage() {
  const code = useQuery().get('code');
  const router = useHistory();

  useEffect(() => {
    async function authorize() {
      try {
        await PlanningCenterApi.authorize(code);
        router.push('/import/planning-center');
      } catch (error) {
        reportError(error);
      }
    }
    if (code) {
      authorize();
    }
  }, [code, router]);

  return <>Connecting to your account...</>;
}
