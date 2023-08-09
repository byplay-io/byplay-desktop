import {useSelector} from 'react-redux';
import {useMemo} from 'react';
import {selectAccessToken} from '../state/auth';
import ByplayAPIClient from '../backend/ByplayAPIClient';

export function useByplayAPI() {
  const token = useSelector(selectAccessToken);
  return useMemo(() => {
    return new ByplayAPIClient(token);
  }, [token]);
}
