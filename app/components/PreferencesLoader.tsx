import React, { useEffect } from 'react';
import Preferences from '../Preferences';
import { useDispatch } from 'react-redux';
import { setRecordingsDirPath } from '../features/recordingsDir/recordingsDirSlice';
import { setAccessToken } from '../features/auth/authSlice';
import { setFFMPEGPath } from '../features/ffmpeg/ffmpegSlice';
import { info } from 'electron-log';
import { setInstalledHoudiniPluginVersion } from '../features/plugins/pluginsSlice';

export default function PreferencesLoader() {
  const dispatch = useDispatch()
  useEffect(() => {
    info("Loading preferences")
    new Preferences().read().then(({recordingsDir, accessToken, ffmpegPath, houdiniPluginVersion}) => {
      if(recordingsDir) {
        dispatch(setRecordingsDirPath(recordingsDir))
      }
      if(accessToken) {
        dispatch(setAccessToken(accessToken))
      }
      if(ffmpegPath) {
        dispatch(setFFMPEGPath(ffmpegPath))
      }
      if(houdiniPluginVersion) {
        dispatch(setInstalledHoudiniPluginVersion(houdiniPluginVersion))
      }
    })
  }, [])

  return null
}
