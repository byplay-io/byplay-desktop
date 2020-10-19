import React, { useEffect } from 'react';
import { selectIsAuthorized } from '../features/auth/authSlice';
import { useSelector } from 'react-redux';
import { selectRecordingsDirPath } from '../features/recordingsDir/recordingsDirSlice';
import Auth from '../features/auth/Auth';
import RecordingsDir from '../features/recordingsDir/RecordingsDir';
import FfmpegDownloadPage from '../features/ffmpeg/FfmpegDownloadPage';
import { selectFfmpegPath } from '../features/ffmpeg/ffmpegSlice';
import { Analytics, AnalyticsUserEventType } from '../backend/Amplitude';

enum SetupState {
  AUTH = "AUTH",
  RECORDING_DIR = "RECORDING_DIR",
  FFMPEG = "FFMPEG",
  DONE = "DONE"
}

export default function Setup(): JSX.Element {
  let isAuthorized = useSelector(selectIsAuthorized)
  let hasRecordingsDir = !!useSelector(selectRecordingsDirPath)
  let downloadedFfmpeg = !!useSelector(selectFfmpegPath)

  let state: SetupState = SetupState.AUTH

  if(isAuthorized) {
    if(!hasRecordingsDir) {
      state = SetupState.RECORDING_DIR
    } else {
      if(!downloadedFfmpeg) {
        state = SetupState.FFMPEG
      } else {
        state = SetupState.DONE
      }
    }
  }

  useEffect(() => {
    Analytics.registerUserEvent(AnalyticsUserEventType.SETUP_PAGE_RENDERED, {
      state
    })
  }, [state])

  return (
    <div data-tid="container">
      { state == SetupState.AUTH ? <Auth /> : null }
      { state == SetupState.RECORDING_DIR || state == SetupState.DONE ? <RecordingsDir /> : null }
      { !downloadedFfmpeg ? <FfmpegDownloadPage asMain={state == SetupState.FFMPEG} /> : null }
    </div>
  );
}
