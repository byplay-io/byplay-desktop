import {combineReducers} from 'redux';
/// / eslint-disable-next-line import/no-cycle
import auth from './state/auth';
import feedback from './state/feedback';
import ffmpeg from './state/ffmpeg';
import plugins from './state/plugins';
import recordings from './state/recordings';
import recordingsList from './state/recordingsList';

export default function createRootReducer() {
  return combineReducers({
    auth,
    feedback,
    ffmpeg,
    plugins,
    recordings,
    recordingsList,
  });
}
