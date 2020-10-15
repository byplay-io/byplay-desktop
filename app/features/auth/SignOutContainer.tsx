import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { setEmptyAccessToken } from './authSlice';
import { Redirect } from 'react-router';
import routes from '../../constants/routes.json';
import { Flex } from 'rebass';
import { setEmptyRecordingsDirPath } from '../recordingsDir/recordingsDirSlice';

export default function SignOutContainer() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setEmptyAccessToken())
    dispatch(setEmptyRecordingsDirPath())
  })
  return <Flex>
    <h1>Signing out...</h1>
    <Redirect to={routes.SETUP} push />
  </Flex>
}
