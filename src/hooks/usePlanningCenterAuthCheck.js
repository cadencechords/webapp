import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';
import { useEffect } from 'react';

const PCO_CLIENT_ID = process.env.REACT_APP_PCO_CLIENT_ID;
const PCO_REDIRECT_URI = process.env.REACT_APP_PCO_REDIRECT_URI;

export default function usePlanningCenterAuthCheck() {
  const currentUser = useSelector(selectCurrentUser);
  const isConnected = currentUser?.pco_connected;

  useEffect(() => {
    if (!isConnected) {
      window.location =
        `https://api.planningcenteronline.com/oauth/authorize?client_id=${PCO_CLIENT_ID}` +
        `&redirect_uri=${PCO_REDIRECT_URI}&response_type=code&scope=services`;
    }
  }, [isConnected]);
  return currentUser?.pco_connected;
}
