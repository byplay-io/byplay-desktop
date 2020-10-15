import React, { useEffect } from 'react';
import Preferences from '../Preferences';
import { useDispatch } from 'react-redux';
import { setRecordingsDirPath } from '../features/recordingsDir/recordingsDirSlice';
import { setAccessToken } from '../features/auth/authSlice';
import { setFFMPEGPath } from '../features/ffmpeg/ffmpegSlice';

export default function PreferencesLoader() {
  const dispatch = useDispatch()
  useEffect(() => {
    console.log("Loading preferences")
    new Preferences().read().then(({recordingsDir, accessToken, ffmpegPath}) => {
      if(recordingsDir) {
        dispatch(setRecordingsDirPath(recordingsDir))
      }
      if(accessToken) {
        dispatch(setAccessToken(accessToken))
      }
      if(ffmpegPath) {
        dispatch(setFFMPEGPath(ffmpegPath))
      }
    })
  }, [])

  return null
}
