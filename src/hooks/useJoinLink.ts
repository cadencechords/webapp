import { useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import JoinLinkApi from '../api/joinLinkApi';
import {
  ERRORED,
  IDLE,
  LOADING,
  RESOLVED,
  type RequestStatus,
} from '../utils/requestStatuses';
import { reportError } from '../utils/error';
import type { Team } from '../types';

/**
 * A failed join link request. The API responds with a message, e.g. 'Does not
 * exist'.
 */
type JoinLinkError = AxiosError<string> | undefined;

export default function useJoinLink(code: string) {
  const [status, setStatus] = useState<RequestStatus>(IDLE);
  const [joinStatus, setJoinStatus] = useState<RequestStatus>(IDLE);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<Team | undefined>(undefined);
  const loading = status === LOADING;
  const resolved = status === RESOLVED;
  const errored = status === ERRORED;
  const idle = status === IDLE;

  const joinLoading = joinStatus === LOADING;
  const joinResolved = joinStatus === RESOLVED;
  const joinErrored = joinStatus === ERRORED;
  const joinIdle = joinStatus === IDLE;

  useEffect(() => {
    async function fetchData() {
      try {
        setStatus(LOADING);
        const { data } = await JoinLinkApi.getByJoinLinkCode(code);
        setData(data);
        setStatus(RESOLVED);
      } catch (error) {
        reportError(error);
        // `as`: the request rejects with an axios error. Anything else thrown
        // here has no response, so this reads undefined, as before.
        setError((error as JoinLinkError)?.response?.data);
        setStatus(ERRORED);
      }
    }

    if (code) {
      fetchData();
    }
  }, [code]);

  async function join() {
    try {
      setJoinStatus(LOADING);
      await JoinLinkApi.join(code);
      setJoinStatus(RESOLVED);
    } catch (error) {
      setJoinStatus(ERRORED);
      reportError(error);
      // `as`: as above, the request rejects with an axios error.
      setError((error as JoinLinkError)?.response?.data);
    }
  }

  return {
    status,
    error,
    data,
    loading,
    errored,
    resolved,
    idle,
    joinErrored,
    joinIdle,
    joinLoading,
    joinResolved,
    joinStatus,
    join,
  };
}
