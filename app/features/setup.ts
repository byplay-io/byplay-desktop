import { RootState } from '../store';

export function selectIsSetUp(state: RootState) {
  if(!state.auth.accessToken) {
    return false
  }
  if(!state.recordingsDir.recordingsDirPath) {
    return false
  }
  if(!state.ffmpeg.path) {
    return false
  }
  return true
}
