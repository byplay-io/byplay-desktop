import React from 'react';
import { selectIsAuthorized } from '../features/auth/authSlice';
import { useSelector } from 'react-redux';
import { selectRecordingsDirPath } from '../features/recordingsDir/recordingsDirSlice';
import Auth from '../features/auth/Auth';
import RecordingsDir from '../features/recordingsDir/RecordingsDir';
import FfmpegDownloadPage from '../features/ffmpeg/FfmpegDownloadPage';
import { selectFfmpegPath } from '../features/ffmpeg/ffmpegSlice';
import { selectIsSetUp } from '../features/setup';
import { Redirect } from 'react-router';
import routes from '../constants/routes.json';

enum SetupState {
  AUTH,
  RECORDING_DIR,
  FFMPEG,
  DONE
}

export default function Setup(): JSX.Element {
  let isSetUp = useSelector(selectIsSetUp)
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

  return (
    <div data-tid="container">
      { state == SetupState.AUTH ? <Auth /> : null }
      { state == SetupState.RECORDING_DIR || state == SetupState.DONE ? <RecordingsDir /> : null }
      { !downloadedFfmpeg ? <FfmpegDownloadPage asMain={state == SetupState.FFMPEG} /> : null }
    </div>
  );
}
