import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
// eslint-disable-next-line import/no-cycle
import authReducer from './features/auth/authSlice';
import pluginsReducer from './features/plugins/pluginsSlice';
import recordingsDirReducer from './features/recordingsDir/recordingsDirSlice';
import ffmpegReducer from './features/ffmpeg/ffmpegSlice';
import recordingsListReducer from './features/recordingsList/recordingsListSlice';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    auth: authReducer,
    plugins: pluginsReducer,
    ffmpeg: ffmpegReducer,
    recordingsDir: recordingsDirReducer,
    recordingsList: recordingsListReducer
  });
}
