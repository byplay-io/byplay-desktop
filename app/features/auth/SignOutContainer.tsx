import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { setEmptyAccessToken } from './authSlice';
import { Redirect } from 'react-router';
import routes from '../../constants/routes.json';
import { Flex } from 'rebass';
import { setEmptyRecordingsDirPath } from '../recordingsDir/recordingsDirSlice';
import { Analytics, AnalyticsUserEventType } from '../../backend/Amplitude';
import Preferences from '../../Preferences';

export default function SignOutContainer() {
  const dispatch = useDispatch()
  useEffect(() => {
    new Preferences().clear()
    dispatch(setEmptyAccessToken())
    dispatch(setEmptyRecordingsDirPath())
    Analytics.registerUserEvent(AnalyticsUserEventType.SIGN_OUT_CLICKED)
  }, [])
  return <Flex>
    <h1>Signing out...</h1>
    <Redirect to={routes.SETUP} push />
  </Flex>
}
