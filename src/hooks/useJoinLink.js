import { useEffect, useState } from 'react';
import JoinLinkApi from '../api/joinLinkApi';
import { ERRORED, IDLE, LOADING, RESOLVED } from '../utils/requestStatuses';
import { reportError } from '../utils/error';

export default function useJoinLink(code) {
  const [status, setStatus] = useState(IDLE);
  const [joinStatus, setJoinStatus] = useState(IDLE);
  const [error, setError] = useState();
  const [data, setData] = useState();
  const loading = status === LOADING;
  const resolved = status === RESOLVED;
  const errored = status === ERRORED;
  const idle = status === IDLE;

  const joinLoading = status === LOADING;
  const joinResolved = status === RESOLVED;
  const joinErrored = status === ERRORED;
  const joinIdle = status === IDLE;

  useEffect(() => {
    async function fetchData() {
      try {
        setStatus(LOADING);
        let { data } = await JoinLinkApi.getByJoinLinkCode(code);
        setData(data);
        setStatus(RESOLVED);
      } catch (error) {
        reportError(error);
        setError(error?.response?.data);
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
      setError(error?.response?.data);
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
