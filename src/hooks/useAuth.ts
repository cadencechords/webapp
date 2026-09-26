import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserApi from '../api/UserApi';
import {
  logOut,
  selectCredentials,
  selectCurrentUser,
  selectHasCredentials,
  setCurrentUser,
} from '../store/authSlice';
import { reportError } from '../utils/error';
import { ERRORED, IDLE, LOADING, RESOLVED } from '../utils/requestStatuses';

export default function useAuth() {
  const credentials = useSelector(selectCredentials);
  const hasCredentials = useSelector(selectHasCredentials);
  const currentUser = useSelector(selectCurrentUser);

  const dispatch = useDispatch();

  const [status, setStatus] = useState(IDLE);
  const resolved = status === RESOLVED;
  const loading = status === LOADING;
  const errored = status === ERRORED;
  const idle = status === IDLE;

  const refreshCurrentUser = useCallback(async () => {
    try {
      setStatus(LOADING);
      let { data } = await UserApi.getCurrentUser();
      setStatus(RESOLVED);
      dispatch(setCurrentUser(data));
    } catch (error) {
      setStatus(ERRORED);
      reportError(error);
      dispatch(logOut());
    }
  }, [dispatch]);

  return {
    credentials,
    hasCredentials,
    currentUser,
    resolved,
    loading,
    idle,
    errored,
    refreshCurrentUser,
  };
}
