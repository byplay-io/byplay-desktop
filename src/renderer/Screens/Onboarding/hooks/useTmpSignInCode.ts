import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  selectTmpSignInCode,
  setAccessToken,
  setTmpSignInCode,
} from '../../../state/auth';
import Preferences from '../../../backend/Preferences';
import {Analytics, AnalyticsUserEventType} from '../../../backend/Amplitude';
import {useByplayAPI} from '../../../hooks/byplayAPI';
import {AppRoute} from '../../routes';

export default function useTmpSignInCode() {
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);

  const tmpSignInCode = useSelector(selectTmpSignInCode);

  const byplayAPI = useByplayAPI();

  const requestTmpSignInCode = useCallback(async () => {
    const tsc = await byplayAPI.authCreateTmpSignInCode();
    if (!tsc.success) {
      return;
    }
    dispatch(
      setTmpSignInCode({
        code: tsc.response.tmp_sign_in_code,
        checkToken: tsc.response?.check_token,
      }),
    );
  }, [byplayAPI, dispatch]);

  useEffect(() => {
    if (tmpSignInCode === null || tmpSignInCode.code === null) {
      void requestTmpSignInCode();
    }
  }, [requestTmpSignInCode, tmpSignInCode]);

  const navigate = useNavigate();

  const rememberToken = useCallback(
    (accessToken: string, userId: string) => {
      dispatch(setAccessToken(accessToken));
      Analytics.registerUserEvent(
        AnalyticsUserEventType.TMP_SIGN_IN_TOKEN_ACTIVATED,
      );
      Analytics.setUserId(userId);

      navigate(AppRoute.ONBOARDING_SELECT_DIR);
    },
    [dispatch, navigate],
  );

  useEffect(() => {
    async function checkTmpCode() {
      if (tmpSignInCode == null || tmpSignInCode.checkToken == null) {
        return;
      }
      const res = await byplayAPI.authCheckTmpSignInCode(
        tmpSignInCode.checkToken,
      );
      setCount(count + 1);
      if (res.success && res.response.activated) {
        rememberToken(res.response.access_token, res.response.user_id);
      }
    }
    const interval = setInterval(checkTmpCode, 2000);
    return () => {
      clearInterval(interval);
    };
  });

  return tmpSignInCode;
}
